// app/components/workspaces/$workspaceId/WSindex.tsx
import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import styles from '../workspace.module.css';
import WorkspaceHeader from './components/WorkspaceHeader';
import WorkspaceGallery from './components/WorkspaceGallery';
import WorkspaceDetails from './components/WorkspaceDetails';
import BookingCard from './components/BookingCard';
import SimilarWorkspaces from './components/SimilarWorkspaces';
import Loading from '../../Common/Loading';
import workspaceService from '../../../services/workspaceService';
import mapsService from '../../../services/mapsService';

// This would be defined in your API or data fetching layer
interface WorkspaceData {
  id: string;
  title: string;
  type: string;
  location: string;
  rating: number;
  reviewCount: number;
  distance: string;
  hours: string;
  description: string;
  amenities: Array<{
    name: string;
    icon: string;
  }>;
  houseRules: Array<{
    text: string;
  }>;
  photos: Array<{
    url: string;
    alt: string;
  }>;
  reviews: Array<{
    id: string;
    reviewer: {
      name: string;
      avatar: string;
    };
    date: string;
    rating: number;
    text: string;
    photos?: Array<{
      url: string;
      alt: string;
    }>;
  }>;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  similar: Array<{
    id: string;
    title: string;
    type: string;
    distance: string;
    amenities: string[];
    price: string;
    rating: number;
    photo: string;
  }>;
}

export default function WorkspaceDetail() {
  const { workspaceId } = useParams({ strict: false });
  const [workspace, setWorkspace] = React.useState<WorkspaceData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) {
        setError('No workspace ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get the workspace details from the API
        const placeDetails = await mapsService.getPlaceDetails(
          workspaceId,
          'name,formatted_address,geometry,photos,rating,types,website,formatted_phone_number,opening_hours,reviews'
        );

        // Get similar workspaces
        const similarWorkspaces = await workspaceService.getSimilarWorkspaces(
          workspaceId,
          workspaceService.determineWorkspaceType(placeDetails.types),
          {
            lat: placeDetails.geometry.location.lat,
            lng: placeDetails.geometry.location.lng
          }
        );

        // Transform the data into our workspace format
        const workspaceData: WorkspaceData = {
          id: workspaceId,
          title: placeDetails.name,
          type: workspaceService.determineWorkspaceType(placeDetails.types),
          location: placeDetails.formatted_address.split(',')[1].trim(),
          rating: placeDetails.rating || 0,
          reviewCount: placeDetails.user_ratings_total || 0,
          distance: '', // Will be calculated based on user location if needed
          hours: placeDetails.opening_hours?.weekday_text?.[0] || 'Hours not available',
          description: `${placeDetails.name} is a ${workspaceService.determineWorkspaceType(placeDetails.types).toLowerCase()} located in ${placeDetails.formatted_address.split(',')[1].trim()}. This workspace offers a comfortable environment for work and study.`,
          amenities: [
            { name: "Free Wi-Fi", icon: "wifi" },
            { name: "Power Outlets", icon: "power" },
            ...(placeDetails.types.includes('library') ? [
              { name: "Study Rooms", icon: "study" },
              { name: "Quiet Zone", icon: "quiet" },
            ] : []),
            ...(placeDetails.types.includes('cafe') ? [
              { name: "Coffee", icon: "cafe" },
              { name: "Food Available", icon: "food" },
            ] : [])
          ],
          houseRules: [
            { text: "Please be respectful of other users" },
            { text: "Keep noise to a minimum" },
            { text: "Clean up after yourself" }
          ],
          photos: placeDetails.photos ? placeDetails.photos.map((photo, index) => ({
            url: mapsService.getPhotoUrl(photo.photo_reference, 800),
            alt: `${placeDetails.name} - Photo ${index + 1}`
          })) : [],
          reviews: placeDetails.reviews ? placeDetails.reviews.map(review => ({
            id: review.time.toString(),
            reviewer: {
              name: review.author_name,
              avatar: review.author_name.split(' ').map(n => n[0]).join('').toUpperCase()
            },
            date: new Date(review.time * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            rating: review.rating,
            text: review.text
          })) : [],
          coordinates: {
            lat: placeDetails.geometry.location.lat,
            lng: placeDetails.geometry.location.lng
          },
          address: placeDetails.formatted_address,
          similar: similarWorkspaces.map(similar => ({
            id: similar.id,
            title: similar.name,
            type: similar.type,
            distance: similar.distance || '2.1 miles away',
            amenities: similar.amenities || ['Wi-Fi'],
            price: workspaceService.getWorkspacePrice(similar.types),
            rating: similar.rating || 4.5,
            photo: similar.photos && similar.photos.length > 0 
              ? mapsService.getPhotoUrl(similar.photos[0])
              : '/api/placeholder/400/250'
          }))
        };
        
        setWorkspace(workspaceData);
      } catch (error) {
        console.error('Error fetching workspace data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load workspace details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkspaceData();
  }, [workspaceId]);
  
  if (loading) {
    return <Loading message="Loading workspace details..." />;
  }

  if (error || !workspace) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Workspace</h2>
        <p>{error || 'Workspace not found'}</p>
        <Link to="/search" className={styles.backButton}>
          Back to Search
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.workspaceContainer}>
      <WorkspaceHeader 
        title={workspace.title} 
        type={workspace.type} 
        location={workspace.location} 
        rating={workspace.rating} 
        reviewCount={workspace.reviewCount} 
        distance={workspace.distance} 
        hours={workspace.hours} 
      />
      
      <WorkspaceGallery photos={workspace.photos} />
      
      <div className={styles.workspaceContent}>
        <WorkspaceDetails 
          description={workspace.description}
          amenities={workspace.amenities}
          houseRules={workspace.houseRules}
          photos={workspace.photos}
          reviews={workspace.reviews}
          coordinates={workspace.coordinates}
          address={workspace.address}
          title={workspace.title}
        />
        
        <BookingCard 
          workspaceId={workspace.id}
          workspaceName={workspace.title}
          workspaceAddress={workspace.address}
          workspaceType={workspace.type}
          workspacePhoto={workspace.photos[0]?.url}
          price={workspace.type === 'Library' ? 'Free' : workspace.type === 'Café' ? 'Purchase Recommended' : 'Contact for Pricing'} 
          priceDescription={workspace.type === 'Library' ? 'Public Library' : 'per hour'} 
          rating={workspace.rating} 
          reviewCount={workspace.reviewCount} 
        />
      </div>
      
      <SimilarWorkspaces workspaces={workspace.similar} />
    </div>
  );
}
import React from 'react';
import { useParams } from '@tanstack/react-router';
import styles from '../workspace.module.css';
import WorkspaceHeader from './components/WorkspaceHeader';
import WorkspaceGallery from './components/WorkspaceGallery';
import WorkspaceDetails from './components/WorkspaceDetails';
import BookingCard from './components/BookingCard';
import SimilarWorkspaces from './components/SimilarWorkspaces';

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
  
  React.useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll just use mock data
        const mockWorkspace: WorkspaceData = {
          id: workspaceId || '1',
          title: "Central Library Workspace",
          type: "Library",
          location: "Downtown",
          rating: 4.98,
          reviewCount: 124,
          distance: "2.1 miles away",
          hours: "8:00 AM - 9:00 PM",
          description: "Nestled in the heart of downtown, the Central Library Workspace offers a peaceful environment perfect for focused work and study. Enjoy natural light from the floor-to-ceiling windows, comfortable seating, and a quiet atmosphere that promotes productivity.",
          amenities: [
            { name: "Free Wi-Fi", icon: "wifi" },
            { name: "Power Outlets", icon: "power" },
            { name: "Climate Control", icon: "climate" },
            { name: "Study Rooms", icon: "study" },
            { name: "Printing Services", icon: "printing" },
            { name: "Quiet Zone", icon: "quiet" },
            { name: "Meeting Facilities", icon: "meeting" },
            { name: "On-site Café", icon: "cafe" }
          ],
          houseRules: [
            { text: "Please keep noise to a minimum in designated quiet zones." },
            { text: "Food is only permitted in designated eating areas." },
            { text: "Group study rooms must be booked in advance." },
            { text: "Please be respectful of library materials and equipment." }
          ],
          photos: [
            { url: "/api/placeholder/800/600", alt: "Central Library Main Hall" },
            { url: "/api/placeholder/400/300", alt: "Central Library Study Area" },
            { url: "/api/placeholder/400/300", alt: "Central Library Reading Zone" },
            { url: "/api/placeholder/300/225", alt: "Group Study Room" },
            { url: "/api/placeholder/300/225", alt: "Reading Nook" },
            { url: "/api/placeholder/300/225", alt: "Computer Station" },
            { url: "/api/placeholder/300/225", alt: "Library Café" }
          ],
          reviews: [
            {
              id: "1",
              reviewer: {
                name: "James Donovan",
                avatar: "JD"
              },
              date: "March 15, 2025",
              rating: 5.0,
              text: "This is my favorite study spot in the city! The natural light from the floor-to-ceiling windows creates such a pleasant environment. The Wi-Fi is lightning fast and there are outlets everywhere. I've been coming here 3 times a week to work on my dissertation and it's perfect."
            },
            {
              id: "2",
              reviewer: {
                name: "Sarah Lin",
                avatar: "SL"
              },
              date: "March 10, 2025",
              rating: 5.0,
              text: "The Central Library is a fantastic place to get work done. I booked a group study room for my team project and it was equipped with everything we needed - whiteboard, large table, and great connectivity. Will definitely use this space again for future team meetings.",
              photos: [
                { url: "/api/placeholder/80/80", alt: "Group study room" },
                { url: "/api/placeholder/80/80", alt: "Whiteboard" }
              ]
            },
            {
              id: "3",
              reviewer: {
                name: "Michael Kim",
                avatar: "MK"
              },
              date: "March 5, 2025",
              rating: 4.0,
              text: "Great workspace overall. I love the quiet environment and the comfortable chairs. The only issue I had was that the café was closed during my visit, so I had to step out for coffee. Otherwise, it's a perfect study spot with excellent amenities."
            }
          ],
          coordinates: { lat: 40.7128, lng: -74.0060 },
          address: "123 Main Street, Downtown\nNew York, NY 10001",
          similar: [
            {
              id: "2",
              title: "University Library",
              type: "Library",
              distance: "3.5 miles away",
              amenities: ["Free Wi-Fi", "Group Rooms"],
              price: "Free",
              rating: 4.9,
              photo: "/api/placeholder/400/250"
            },
            {
              id: "3",
              title: "Downtown Café",
              type: "Café",
              distance: "0.8 miles away",
              amenities: ["Great Coffee", "Wi-Fi"],
              price: "$5/hr min",
              rating: 4.7,
              photo: "/api/placeholder/400/250"
            },
            {
              id: "4",
              title: "Innovation Hub",
              type: "Co-working",
              distance: "1.2 miles away",
              amenities: ["Meeting Rooms", "High-Speed Wi-Fi"],
              price: "$15/hr",
              rating: 4.9,
              photo: "/api/placeholder/400/250"
            },
            {
              id: "5",
              title: "Community Center",
              type: "Community",
              distance: "2.5 miles away",
              amenities: ["Free Wi-Fi", "Quiet"],
              price: "Free",
              rating: 4.6,
              photo: "/api/placeholder/400/250"
            }
          ]
        };
        
        setWorkspace(mockWorkspace);
      } catch (error) {
        console.error('Error fetching workspace data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkspaceData();
  }, [workspaceId]);
  
  if (loading) {
    return <div className={styles.loadingIndicator}>Loading workspace...</div>;
  }
  
  if (!workspace) {
    return <div>Workspace not found</div>;
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
        />
        
        <BookingCard 
          price="Free" 
          priceDescription="Public Library" 
          rating={workspace.rating} 
          reviewCount={workspace.reviewCount} 
        />
      </div>
      
      <SimilarWorkspaces workspaces={workspace.similar} />
    </div>
  );
}
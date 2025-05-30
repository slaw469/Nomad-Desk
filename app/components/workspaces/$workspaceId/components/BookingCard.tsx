// app/components/workspaces/$workspaceId/components/BookingCard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styles from '../../workspace.module.css';
import { bookingService, type BookingRequest } from '../../../../services/bookingService';
import Loading from '../../../Common/Loading';

interface BookingCardProps {
  workspaceId: string;
  workspaceName: string;
  workspaceAddress: string;
  workspaceType: string;
  workspacePhoto?: string;
  price: string;
  priceDescription: string;
  rating: number;
  reviewCount: number;
  onContactHost?: () => void; // NEW: Optional callback for contact host
}



export default function BookingCard({
  workspaceId,
  workspaceName,
  workspaceAddress,
  workspaceType,
  workspacePhoto,
  price,
  priceDescription,
  rating,
  reviewCount,
  onContactHost // NEW: Destructure the callback
}: BookingCardProps) {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Initialize state with URL search params if available
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [numPeople, setNumPeople] = useState(() => {
    const people = searchParams.get('numberOfPeople');
    return people ? `${people} ${parseInt(people) === 1 ? 'person' : 'people'}` : '1 person';
  });
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '08:00');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '09:00');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'Individual Desk');
  const [requests, setRequests] = useState(searchParams.get('specialRequests') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Helper function to convert "X people" to number
  const parseNumPeople = (numPeopleStr: string): number => {
    if (numPeopleStr.includes('5+')) return 5;
    const match = numPeopleStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  // Helper function to format time for API (24-hour format)
  

  // Generate time options
  const generateTimeOptions = (isEndTime = false) => {
    const options = [];
    const startHour = isEndTime ? 9 : 8; // End time starts at 9 AM
    const endHour = isEndTime ? 21 : 20; // End time goes to 9 PM
    
    for (let i = startHour; i <= endHour; i++) {
      const hour12 = i > 12 ? i - 12 : i === 0 ? 12 : i;
      const period = i >= 12 ? 'PM' : 'AM';
      const displayTime = `${hour12}:00 ${period}`;
      const value = `${i.toString().padStart(2, '0')}:00`;
      options.push({ display: displayTime, value });
    }
    return options;
  };

  // Helper function to get available people options based on room type
  const getPeopleOptions = (selectedRoomType: string) => {
    switch (selectedRoomType) {
      case 'Group Study Room (2-4 people)':
        return ['2 people', '3 people', '4 people'];
      case 'Individual Desk':
      case 'Computer Station':
      case 'Reading Area':
      case 'Private Study Room':
        return ['1 person'];
      default:
        return ['1 person', '2 people', '3 people', '4 people', '5+ people'];
    }
  };

  // Update number of people when room type changes
  useEffect(() => {
    const options = getPeopleOptions(roomType);
    if (!options.includes(numPeople)) {
      setNumPeople(options[0]);
    }
  }, [roomType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      setError('Please select a date');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Check availability first
      const availability = await bookingService.checkAvailability(
        workspaceId,
        date,
        startTime,
        endTime
      );

      if (!availability.available) {
        setError('This time slot is not available. Please choose a different time.');
        setIsSubmitting(false);
        return;
      }

      // Create booking data - NOW INCLUDING WORKSPACE DETAILS
      const bookingData: BookingRequest = {
        workspaceId,
        workspaceName, // NEW: Pass the real workspace name
        workspaceAddress, // NEW: Pass the real workspace address  
        workspaceType, // NEW: Pass the real workspace type
        workspacePhoto, // NEW: Pass the workspace photo URL
        date,
        startTime,
        endTime,
        roomType,
        numberOfPeople: parseNumPeople(numPeople),
        specialRequests: requests.trim() || undefined,
        isGroupBooking: false // Explicitly set for individual bookings
      };
      
      // Create the booking
      const newBooking = await bookingService.createBooking(bookingData);
      
      console.log('Booking created successfully:', newBooking);
      setSuccess(true);
      
      // Show success message for 2 seconds, then redirect to dashboard
      setTimeout(() => {
        navigate({ to: '/dashboard' });
      }, 2000);
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price (for display purposes)
  const calculateTotalPrice = (): string => {
    if (price === 'Free') return 'Free';
    if (price === 'Purchase Recommended') return 'Purchase Recommended';
    if (price === 'Contact for Pricing') return 'Contact for Pricing';
    
    // Extract price per hour if it's in $X format
    const priceMatch = price.match(/\$(\d+)/);
    if (!priceMatch) return price;
    
    const pricePerHour = parseInt(priceMatch[1]);
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const duration = endHour - startHour;
    
    const totalPrice = pricePerHour * duration;
    return `$${totalPrice.toFixed(2)}`;
  };
  
  if (success) {
    return (
      <div className={styles.bookingCard}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10B981"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Booking Confirmed!</h3>
          <p>Your workspace has been reserved successfully.</p>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.bookingCard}>
      <div className={styles.priceSection}>
        <div className={styles.priceDisplay}>
          <span className={styles.price}>{price}</span>
          <span className={styles.pricePeriod}>{priceDescription}</span>
        </div>
        <div className={styles.priceRating}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{rating} · {reviewCount} reviews</span>
        </div>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}
      
      <form className={styles.bookingForm} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date</label>
            <input 
              type="date" 
              className={styles.formControl} 
              min={new Date().toISOString().split('T')[0]} 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Number of People</label>
            <select 
              className={styles.formControl}
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              disabled={isSubmitting}
            >
              {getPeopleOptions(roomType).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>From</label>
            <select 
              className={styles.formControl}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isSubmitting}
            >
              {generateTimeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>To</label>
            <select 
              className={styles.formControl}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isSubmitting}
            >
              {generateTimeOptions(true).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Room Type</label>
          <select 
            className={styles.formControl}
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            disabled={isSubmitting}
          >
            <option>Individual Desk</option>
            <option>Group Study Room (2-4 people)</option>
            <option>Private Study Room</option>
            <option>Computer Station</option>
            <option>Reading Area</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Special Requests (Optional)</label>
          <textarea 
            className={styles.formControl} 
            rows={3} 
            placeholder="Any specific requirements or preferences?"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className={styles.bookButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loading message="" />
              <span style={{ marginLeft: '8px' }}>Creating Booking...</span>
            </>
          ) : (
            'Reserve Now'
          )}
        </button>
      </form>
      
      <div className={styles.bookingSummary}>
        <div className={styles.summaryRow}>
          <span>{roomType}</span>
          <span>{calculateTotalPrice()}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Service fee</span>
          <span>$0.00</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>{calculateTotalPrice()}</span>
        </div>
      </div>
      
      <div className={styles.workspaceContact}>
        <p className={styles.contactText}>Have questions about this space?</p>
        <button 
          className={styles.contactHost} 
          type="button"
          onClick={onContactHost} // NEW: Use the callback
        >
          Contact Workspace Host
        </button>
      </div>
    </div>
  );
}
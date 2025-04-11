// app/routes/workspaces/$workspaceId/components/BookingCard.tsx
import React, { useState } from 'react';
import styles from '../../workspace.module.css';

interface BookingCardProps {
  price: string;
  priceDescription: string;
  rating: number;
  reviewCount: number;
}

export default function BookingCard({
  price,
  priceDescription,
  rating,
  reviewCount
}: BookingCardProps) {
  const [date, setDate] = useState('');
  const [numPeople, setNumPeople] = useState('1 person');
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('9:00 AM');
  const [roomType, setRoomType] = useState('Individual Desk');
  const [requests, setRequests] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    const bookingData = {
      date,
      numPeople,
      startTime,
      endTime,
      roomType,
      requests
    };
    
    console.log('Booking submitted:', bookingData);
    // You would typically show a confirmation or error message here
  };
  
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
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Number of People</label>
            <select 
              className={styles.formControl}
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
            >
              <option>1 person</option>
              <option>2 people</option>
              <option>3 people</option>
              <option>4 people</option>
              <option>5+ people</option>
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
            >
              {[...Array(12)].map((_, i) => (
                <option key={i}>{`${i + 8 > 12 ? i - 4 : i + 8}:00 ${i + 8 >= 12 ? 'PM' : 'AM'}`}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>To</label>
            <select 
              className={styles.formControl}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              {[...Array(13)].map((_, i) => (
                <option key={i}>{`${i + 9 > 12 ? i - 3 : i + 9}:00 ${i + 9 >= 12 ? 'PM' : 'AM'}`}</option>
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
          ></textarea>
        </div>
        
        <button type="submit" className={styles.bookButton}>
          Reserve Now
        </button>
      </form>
      
      <div className={styles.bookingSummary}>
        <div className={styles.summaryRow}>
          <span>{roomType}</span>
          <span>{price}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Service fee</span>
          <span>$0.00</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>{price}</span>
        </div>
      </div>
      
      <div className={styles.workspaceContact}>
        <p className={styles.contactText}>Have questions about this space?</p>
        <button className={styles.contactHost}>Contact Workspace Host</button>
      </div>
    </div>
  );
}
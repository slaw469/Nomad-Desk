import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bookingService, Booking, BookingRequest } from '../../services/bookingService';
import styles from './ModifyBookingModal.module.css';

interface ModifyBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onModified: (updatedBooking: Booking) => void;
}

const ModifyBookingModal: React.FC<ModifyBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onModified
}) => {
  console.log('=== Component Render ===');
  console.log('Props:', { isOpen, bookingId: booking.id });

  const [date, setDate] = useState(booking.date);
  const [startTime, setStartTime] = useState(booking.startTime);
  const [endTime, setEndTime] = useState(booking.endTime);
  const [numberOfPeople, setNumberOfPeople] = useState(booking.numberOfPeople);
  const [specialRequests, setSpecialRequests] = useState(booking.specialRequests || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const successTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const submitCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const updatedBookingRef = useRef<Booking | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    console.log('=== Component Mounted ===');

    return () => {
      console.log('=== Component Unmounting ===');
      isMountedRef.current = false;
      
      if (successTimeoutRef.current) {
        console.log('Clearing success timeout on unmount');
        clearTimeout(successTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        console.log('Clearing close timeout on unmount');
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('=== Effect: isOpen Changed ===');
    console.log('isOpen:', isOpen);
    console.log('Current States:', { loading, success, error, isClosing });
    console.log('Submit Count:', submitCountRef.current);

    if (!isOpen && isMountedRef.current) {
      console.log('Modal closing, resetting states');
      setError(null);
      setSuccess(null);
      setIsClosing(false);
      submitCountRef.current = 0;
      updatedBookingRef.current = null;
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    console.log('=== handleClose Called ===');
    console.log('States:', { loading, success, error, isClosing });
    console.log('Submit Count:', submitCountRef.current);
    console.log('Component Mounted:', isMountedRef.current);

    if (!isMountedRef.current) {
      console.log('Component not mounted, skipping close');
      return;
    }

    setIsClosing(true);
    
    closeTimeoutRef.current = window.setTimeout(() => {
      console.log('=== Close Timeout Executing ===');
      console.log('Component still mounted:', isMountedRef.current);
      if (isMountedRef.current) {
        if (updatedBookingRef.current) {
          console.log('Calling onModified with updated booking');
          onModified(updatedBookingRef.current);
        }
        onClose();
      }
    }, 1000);
  }, [loading, success, onClose, onModified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isMountedRef.current) {
      console.log('Component not mounted, skipping submit');
      return;
    }

    submitCountRef.current += 1;
    console.log('=== Form Submit Attempt ===');
    console.log('Submit Count:', submitCountRef.current);
    console.log('States:', { loading, success, error, isClosing });
    console.log('Form Data:', { date, startTime, endTime, numberOfPeople });
    console.log('Component Mounted:', isMountedRef.current);

    if (loading) {
      console.log('Already loading, preventing submission');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsClosing(false);

    try {
      console.log('=== Making API Request ===');
      const selectedDate = new Date(date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const adjustedDate = selectedDate.toISOString().split('T')[0];
      
      console.log('Date adjustment:', {
        originalDate: date,
        adjustedDate: adjustedDate,
        timezoneOffset: new Date().getTimezoneOffset()
      });

      const bookingData: BookingRequest = {
        workspaceId: booking.workspace.id,
        workspaceName: booking.workspace.name,
        workspaceAddress: booking.workspace.address,
        workspaceType: booking.workspace.type || 'default',
        workspacePhoto: booking.workspace.photo,
        date: adjustedDate,
        startTime,
        endTime,
        numberOfPeople,
        specialRequests,
        isGroupBooking: booking.isGroupBooking || false,
        roomType: booking.roomType || 'Individual Desk'
      };

      const updatedBooking = await bookingService.updateBooking(booking.id, bookingData);

      console.log('=== API Response Received ===');
      console.log('Success:', !!updatedBooking);
      console.log('Component still mounted:', isMountedRef.current);

      if (updatedBooking && isMountedRef.current) {
        updatedBookingRef.current = updatedBooking;
        setLoading(false);
        setSuccess('Booking successfully modified!');
        
        console.log('=== Setting Success Timeout ===');
        successTimeoutRef.current = window.setTimeout(() => {
          console.log('=== Success Timeout Executing ===');
          console.log('Component still mounted:', isMountedRef.current);
          if (isMountedRef.current && !isClosing) {
            handleClose();
          }
        }, 2000);
      }
    } catch (err) {
      console.error('=== API Error ===', err);
      if (isMountedRef.current) {
        let errorMessage = 'Failed to modify booking. Please try again.';
        if (err instanceof Error) {
          errorMessage = err.message.includes('Error:') ? err.message : errorMessage;
        }
        setError(errorMessage);
        setLoading(false);
      }
    }
  };

  console.log('=== Pre-render State ===');
  console.log('States:', { loading, success, error, isClosing });
  console.log('Submit Count:', submitCountRef.current);
  console.log('Component Mounted:', isMountedRef.current);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Modify Booking</h2>
          <button 
            onClick={() => {
              if (!loading && submitCountRef.current === 0) handleClose();
            }} 
            className={styles.closeButton}
            disabled={loading || submitCountRef.current > 0}
          >
            ×
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div 
          className={`${styles.successContainer} ${success ? styles.visible : ''}`}
        >
          <div 
            className={`${styles.success} ${isClosing ? styles.fadeOut : ''}`}
            onAnimationStart={() => console.log('Success animation started')}
            onAnimationEnd={() => console.log('Success animation ended')}
          >
            {success || 'Booking successfully modified!'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="numberOfPeople">Number of People</label>
            <input
              type="number"
              id="numberOfPeople"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              placeholder="Any special requirements or requests..."
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => {
                if (!loading && submitCountRef.current === 0) handleClose();
              }}
              className={styles.cancelButton}
              disabled={loading || submitCountRef.current > 0}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || submitCountRef.current > 0}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Modifying...
                </>
              ) : (
                'Modify Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyBookingModal;
import React, { useState, useEffect } from 'react';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
  workspaceName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceName
}) => {
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, review);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setReview('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      if (e.target === e.currentTarget && !isSubmitting) onClose();
    }}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          disabled={isSubmitting}
        >×</button>
        <h2 className={styles.modalTitle}>Review {workspaceName}</h2>
        
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.ratingSection}>
            <label>Your Rating</label>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => !isSubmitting && setRating(star)}
                  className={`${styles.starButton} ${star <= rating ? styles.active : ''}`}
                  disabled={isSubmitting}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <label htmlFor="review">Your Review</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this workspace..."
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 
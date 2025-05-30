// app/components/Bookings/GroupBookingForm.tsx - GROUP BOOKING FORM COMPONENT

import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { groupBookingService } from '../../services/bookingService';
import { 
  GroupBookingFormData, 
  GroupBookingFormErrors,
  GroupBookingRequest 
} from '../../types/groupBooking';
import styles from './GroupBookingForm.module.css';

interface GroupBookingFormProps {
  workspaceId: string;
  workspaceName: string;
  workspaceAddress: string;
  workspaceType: string;
  workspacePhoto?: string;
  onBookingCreated?: (booking: any) => void;
  onCancel?: () => void;
}

const GroupBookingForm: React.FC<GroupBookingFormProps> = ({
  workspaceId,
  workspaceName,
  workspaceAddress,
  workspaceType,
  workspacePhoto,
  onBookingCreated,
  onCancel
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<GroupBookingFormErrors>({});

  // Form state
  const [formData, setFormData] = useState<GroupBookingFormData>({
    workspace: {
      id: workspaceId,
      name: workspaceName,
      address: workspaceAddress,
      type: workspaceType,
      photo: workspacePhoto
    },
    date: '',
    startTime: '',
    endTime: '',
    roomType: 'Large Conference Room (10+ people)',
    groupName: '',
    groupDescription: '',
    maxParticipants: 10,
    minParticipants: 2,
    isPublic: false,
    tags: [],
    specialRequests: '',
    allowParticipantInvites: false,
    requireApproval: true,
    sendReminders: true
  });

  // Available room types for group bookings
  const groupRoomTypes = [
    'Large Conference Room (10+ people)',
    'Event Space',
    'Workshop Room',
    'Meeting Room',
    'Group Study Room (2-4 people)'
  ];

  // Common tags for group bookings
  

  // Get tomorrow's date as minimum date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Handle input changes
  const handleInputChange = (field: keyof GroupBookingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (errors[field as keyof GroupBookingFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle tag selection
  

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: GroupBookingFormErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.roomType) newErrors.roomType = 'Room type is required';
    if (!formData.groupName.trim()) newErrors.groupName = 'Group name is required';
    
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (formData.maxParticipants < 2) {
      newErrors.maxParticipants = 'Maximum participants must be at least 2';
    }

    if (formData.maxParticipants > 50) {
      newErrors.maxParticipants = 'Maximum participants cannot exceed 50';
    }

    if (formData.minParticipants < 1) {
      newErrors.minParticipants = 'Minimum participants must be at least 1';
    }

    if (formData.minParticipants > formData.maxParticipants) {
      newErrors.minParticipants = 'Minimum cannot exceed maximum participants';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const bookingRequest: GroupBookingRequest = {
        workspaceId: formData.workspace.id,
        workspaceName: formData.workspace.name,
        workspaceAddress: formData.workspace.address,
        workspaceType: formData.workspace.type,
        workspacePhoto: formData.workspace.photo,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        roomType: formData.roomType,
        groupName: formData.groupName,
        groupDescription: formData.groupDescription,
        maxParticipants: formData.maxParticipants,
        minParticipants: formData.minParticipants,
        isPublic: formData.isPublic,
        tags: formData.tags,
        specialRequests: formData.specialRequests,
        groupSettings: {
          allowParticipantInvites: formData.allowParticipantInvites,
          requireApproval: formData.requireApproval,
          sendReminders: formData.sendReminders
        }
      };

      const createdBooking = await groupBookingService.createGroupBooking(bookingRequest);
      
      console.log('✅ Group booking created:', createdBooking);
      
      if (onBookingCreated) {
        onBookingCreated(createdBooking);
      } else {
        // Navigate to the created group booking
        navigate({ to: `/group-bookings/${createdBooking.id}` });
      }
    } catch (error) {
      console.error('❌ Failed to create group booking:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to create group booking'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.groupBookingForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create Group Booking</h2>
        <p className={styles.formSubtitle}>
          Organize a study session or meeting at {workspaceName}
        </p>
      </div>

      {errors.general && (
        <div className={styles.errorAlert}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Workspace Info */}
        <div className={styles.workspaceInfo}>
          <div className={styles.workspaceDetails}>
            <h3>{workspaceName}</h3>
            <p>{workspaceAddress}</p>
            <span className={styles.workspaceType}>{workspaceType}</span>
          </div>
        </div>

        {/* Basic Details */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Basic Details</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="groupName" className={styles.label}>
                Group Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="groupName"
                value={formData.groupName}
                onChange={(e) => handleInputChange('groupName', e.target.value)}
                className={`${styles.input} ${errors.groupName ? styles.inputError : ''}`}
                placeholder="e.g., JavaScript Study Group"
                maxLength={100}
              />
              {errors.groupName && (
                <span className={styles.errorText}>{errors.groupName}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="groupDescription" className={styles.label}>
                Description
              </label>
              <textarea
                id="groupDescription"
                value={formData.groupDescription}
                onChange={(e) => handleInputChange('groupDescription', e.target.value)}
                className={styles.textarea}
                placeholder="Describe what your group will be working on..."
                maxLength={500}
                rows={3}
              />
              <div className={styles.charCount}>
                {formData.groupDescription.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Date & Time</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                min={getMinDate()}
              />
              {errors.date && (
                <span className={styles.errorText}>{errors.date}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startTime" className={styles.label}>
                Start Time <span className={styles.required}>*</span>
              </label>
              <select
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`${styles.select} ${errors.startTime ? styles.inputError : ''}`}
              >
                <option value="">Select start time</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.startTime && (
                <span className={styles.errorText}>{errors.startTime}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime" className={styles.label}>
                End Time <span className={styles.required}>*</span>
              </label>
              <select
                id="endTime"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={`${styles.select} ${errors.endTime ? styles.inputError : ''}`}
              >
                <option value="">Select end time</option>
                {timeOptions
                  .filter(time => !formData.startTime || time > formData.startTime)
                  .map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
              </select>
              {errors.endTime && (
                <span className={styles.errorText}>{errors.endTime}</span>
              )}
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Room & Participants</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="roomType" className={styles.label}>
                Room Type <span className={styles.required}>*</span>
              </label>
              <select
                id="roomType"
                value={formData.roomType}
                onChange={(e) => handleInputChange('roomType', e.target.value)}
                className={`${styles.select} ${errors.roomType ? styles.inputError : ''}`}
              >
                {groupRoomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.roomType && (
                <span className={styles.errorText}>{errors.roomType}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="minParticipants" className={styles.label}>
                Minimum Participants
              </label>
              <input
                type="number"
                id="minParticipants"
                value={formData.minParticipants}
                onChange={(e) => handleInputChange('minParticipants', parseInt(e.target.value))}
                className={`${styles.input} ${errors.minParticipants ? styles.inputError : ''}`}
                min={1}
                max={50}
              />
              {errors.minParticipants && (
                <span className={styles.errorText}>{errors.minParticipants}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants" className={styles.label}>
                Maximum Participants
              </label>
              <input
                type="number"
                id="maxParticipants"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                className={`${styles.input} ${errors.maxParticipants ? styles.inputError : ''}`}
                min={2}
                max={50}
              />
              {errors.maxParticipants && (
                <span className={styles.errorText}>{errors.maxParticipants}</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Group Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupBookingForm;
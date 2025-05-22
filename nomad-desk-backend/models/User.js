// nomad-desk-backend/models/User.js
const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  field: {
    type: String,
    required: true
  },
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number
  },
  current: {
    type: Boolean,
    default: false
  }
});

const SocialLinksSchema = new mongoose.Schema({
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  }
});

const StudyPreferencesSchema = new mongoose.Schema({
  preferredEnvironments: [{
    type: String,
    enum: ['library', 'cafe', 'coworking', 'home', 'outdoors']
  }],
  noiseLevel: {
    type: String,
    enum: ['silent', 'quiet', 'moderate', 'lively'],
    default: 'quiet'
  },
  preferredTimes: [{
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  }],
  groupSize: {
    type: String,
    enum: ['solo', 'small', 'medium', 'large'],
    default: 'small'
  }
});

const PreferencesSchema = new mongoose.Schema({
  privateProfile: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  studyPreferences: StudyPreferencesSchema
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    // Allow null for social login users
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  profession: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  timezone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  interests: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  education: [EducationSchema],
  socialLinks: {
    type: SocialLinksSchema,
    default: () => ({})
  },
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  },
  // Profile statistics
  profileViews: {
    type: Number,
    default: 0
  },
  workspacesVisited: {
    type: Number,
    default: 0
  },
  reviewsGiven: {
    type: Number,
    default: 0
  },
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Update lastActive before saving
UserSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActive = Date.now();
  }
  next();
});

// Virtual for full name parts
UserSchema.virtual('initials').get(function() {
  const nameParts = this.name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', UserSchema);
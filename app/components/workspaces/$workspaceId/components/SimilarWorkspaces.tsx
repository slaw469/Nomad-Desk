import React from 'react';
import { Link } from '@tanstack/react-router';

interface Workspace {
  id: string;
  title: string;
  type: string;
  distance: string;
  amenities: string[];
  price: string;
  rating: number;
  photo: string;
}

interface SimilarWorkspacesProps {
  workspaces: Workspace[];
}

export default function SimilarWorkspaces({ workspaces }: SimilarWorkspacesProps) {
  if (!workspaces || workspaces.length === 0) {
    return null;
  }
  
  return (
    <div className="similar-workspaces">
      <h2 className="similar-title">Similar Workspaces Nearby</h2>
      <div className="workspace-cards">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="workspace-card">
            <div className="card-image">
              <Link to={`/workspaces/${workspace.id}`}>
                <img src={workspace.photo} alt={workspace.title} />
              </Link>
              <div className="card-favorite">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="card-content">
              <Link to={`/workspaces/${workspace.id}`} className="card-title">
                {workspace.title}
              </Link>
              <p className="card-location">{workspace.distance}</p>
              <div className="card-amenities">
                {workspace.amenities.slice(0, 2).map((amenity, index) => (
                  <span key={index} className="card-amenity">{amenity}</span>
                ))}
              </div>
              <div className="card-footer">
                <div className="card-price">{workspace.price}</div>
                <div className="card-rating">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {workspace.rating.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
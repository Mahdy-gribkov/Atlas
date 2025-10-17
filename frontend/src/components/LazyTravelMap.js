import React, { Suspense } from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

// Lazy load the TravelMap component
const TravelMap = React.lazy(() => import('./TravelMap'));

function LazyTravelMap(props) {
  return (
    <LazyLoadComponent>
      <Suspense fallback={
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      }>
        <TravelMap {...props} />
      </Suspense>
    </LazyLoadComponent>
  );
}

export default LazyTravelMap;

"use client";

import { ItineraryDisplay } from '@/components/itinerary/ItineraryDisplay';

interface ItineraryPageProps {
  params: {
    id: string;
  };
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit itinerary:', params.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete itinerary:', params.id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share itinerary:', params.id);
  };

  return (
    <ItineraryDisplay
      onEdit={handleEdit}
      onDelete={handleDelete}
      onShare={handleShare}
    />
  );
}
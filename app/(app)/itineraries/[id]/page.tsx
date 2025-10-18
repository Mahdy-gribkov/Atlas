import { notFound } from 'next/navigation';
import { ItineraryDisplay } from '@/components/itinerary/ItineraryDisplay';
import { ItineraryService } from '@/services/itinerary.service';

interface ItineraryPageProps {
  params: {
    id: string;
  };
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const itineraryService = new ItineraryService();
  const itinerary = await itineraryService.getItineraryById(params.id);

  if (!itinerary) {
    notFound();
  }

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit itinerary:', itinerary.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete itinerary:', itinerary.id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share itinerary:', itinerary.id);
  };

  return (
    <ItineraryDisplay
      itinerary={itinerary}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onShare={handleShare}
    />
  );
}

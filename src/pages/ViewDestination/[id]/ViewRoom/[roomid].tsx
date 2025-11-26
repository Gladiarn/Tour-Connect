import { ViewRoomPageProps } from '@/components/types';
import { GetServerSideProps } from 'next';
import React from 'react'

const hotels = [
  {
    id: 1,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 1,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 2,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 3,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
      {
        id: 4,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
        id: 2,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 5,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
        id: 3,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 6,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
  {
    id:4,
    name: "Ocean Breeze Resort",
    images: [
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
      "https://media.istockphoto.com/id/1390168364/photo/pristine-and-turquoise-blue-green-beach-under-blue-sky-portuguese-island-in-maputo-mozambique.webp?a=1&b=1&s=612x612&w=0&k=20&c=BuIhVQEMx9SrmO1iv9Dmw9wMxtBhgx2UgCKGp6K1Bnc=",
    ],
    duration: "20 minutes by boat",
    rooms: [
      {
        id: 7,
        image:
          "https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.webp?a=1&b=1&s=612x612&w=0&k=20&c=mSGn9G9SW4_mphJ1xKU_ad-xbLadiDpMH4vjTrpMldY=",
        name: "Deluxe Sea View Room",
        features: [
          "1 King-size bed",
          "Free breakfast",
          "Private balcony",
          "Air conditioning",
        ],
        facilities: [
          "Swimming pool",
          "Free WiFi",
          "Gym access",
          "Beachfront",
          "Restaurant",
        ],
        description:
          "A spacious room with a panoramic view of the ocean, perfect for couples or solo travelers seeking comfort and relaxation.",
        price: 4500,
      },
    ],
    rating: 1.6,
  },
];

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id, roomid } = params as {
    id: string;
    roomid: string;
  };
  const hotel = hotels.find(h => h.id === Number(id));
  
  if (!hotel) {
    return { notFound: true };
  }

  const room = hotel.rooms.find(r => r.id === Number(roomid));

  if (!room) {
    return { notFound: true };
  }

  return {
    props: {
      destination: hotel,
      room: room,
    },
  };
};

export default function ViewRoomPage({ destination, room } : ViewRoomPageProps) {

  return (
    <div className='min-h-[500px] text-black bg-white pt-[200px]'>
      {destination.name}
      {room.name}
    </div>
  )
}

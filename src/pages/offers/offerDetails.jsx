// /* eslint-disable no-unused-vars */
// import OffersSidebar from "@/Components/offers/offer_sidebar";
// import OfferPage from "@/Components/offers/offer_page";

// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import api from "@/utils/axios";

// const fetchOffers = () =>
//   api
//     .get(`${import.meta.env.VITE_BACKEND_URL}/offers`)
//     .then((res) => res.data ?? []);

// const fetchOfferById = (id) =>
//   api
//     .get(`${import.meta.env.VITE_BACKEND_URL}/offers/${id}`)
//     .then((res) => res.data?.offer ?? res.data ?? null);

// export default function OfferDetails() {
//   const { id } = useParams();

//   const {
//     data: offers = [],
//     isLoading: listLoading,
//     isError: listError,
//   } = useQuery({
//     queryKey: ["offers"],
//     queryFn: fetchOffers,
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });

//   const {
//     data: offer,
//     isLoading: offerLoading,
//     isError: offerError,
//     isFetching: offerFetching,
//   } = useQuery({
//     queryKey: ["offer", id],
//     queryFn: () => fetchOfferById(id),
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });
//   console.log(offers);
//   console.log(offer);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <OffersSidebar data={offers} />
//       <OfferPage data={offer} />
//     </div>
//   );
// }
import React from 'react'

export default function offerDetails() {
  return (
    <div>offerDetails</div>
  )
}


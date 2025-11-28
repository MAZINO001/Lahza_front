// import { create } from "zustand";

// export const useRegisterStore = create((set) => ({
//   // common fields
//   role: "equipe", // "equipe" | "client"
//   nom: "",
//   email: "",
//   mot_de_passe: "",
//   mot_de_passe_confirmation: "",

//   // worker-specific
//   poste: "",
//   departement: "",
//   specialite: "",
//   linkdin: "",
//   portfolio: "",
//   github: "",
//   date_debut: "",
//   date_fin: "",
//   description: "",
//   tags: [],
//   cv: "",
//   // client-specific
//   entreprise: "",
//   adresse: "",
//   zip: "",
//   telephone: "",
//   ville: "",
//   pays: "",
//   type_client: "", // "particulier" | "entreprise"
//   tva: "",
//   siren: "",
//   ice: "",
//   devise: "",

//   // generic handlers
//   setField: (key, value) =>
//     set((state) => ({ ...state, [key]: value })),

//   reset: () =>
//     set({
//       role: "equipe",
//       // nom: "",
//       // email: "",
//       // mot_de_passe: "",
//       // mot_de_passe_confirmation: "",
//       poste: "",
//       departement: "",
//       specialite: "",
//       linkdin: "",
//       portfolio: "",
//       github: "",
//       date_debut: "",
//       date_fin: "",
//       description: "",
//       entreprise: "",
//       adresse: "",
//       zip: "",
//       telephone: "",
//       ville: "",
//       pays: "",
//       type_client: "",
//       tva: "",
//       siren: "",
//       ice: "",
//       devise: "",
//       tags: [],
//     }),
// }));

import { create } from "zustand";

export const useRegisterStore = create((set) => ({
  // common fields
  user_type: "team", // "team" | "client"
  name: "",
  email: "",
  password: "",
  password_confirmation: "",

  // worker-specific
  position: "",
  department: "",
  specialty: "",
  linkedin: "",
  portfolio: "",
  github: "",
  start_date: "",
  end_date: "",
  description: "",
  tags: ["imprimeur", "commercial", "filmmaker"],
  resume: "",
  company: "",
  address: "",
  zip: "",
  phone: "",
  city: "",
  country: "",
  client_type: "",
  vat: "",
  siren: "",
  ice: "",
  currency: "",

  setField: (key, value) =>
    set((state) => ({ ...state, [key]: value })),

  reset: () =>
    set({
      user_type: "team",
      // name: "",
      // email: "",
      // password: "",
      // password_confirmation: "",
      position: "",
      department: "",
      specialty: "",
      linkedin: "",
      portfolio: "",
      github: "",
      start_date: "",
      end_date: "",
      description: "",
      company: "",
      address: "",
      zip: "",
      phone: "",
      city: "",
      country: "",
      client_type: "",
      vat: "",
      siren: "",
      ice: "",
      currency: "",
      resume: "",
      poste: "",
    }),

}));


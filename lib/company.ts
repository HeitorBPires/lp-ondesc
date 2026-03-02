type CompanyProfile = {
  brandName: string;
  legalName?: string;
  cnpj?: string;
  address?: string;
  email?: string;
};

export function getCompanyProfile(): CompanyProfile {
  return {
    brandName: "ONDESC",
    legalName: "Ondesc Energy",
    cnpj: "57.044.775/0001-86",
    address: "R CRISTOVAO COLOMBO, 1375, CASCAVEL, PR",
    email: "CONTATO@ONDESCENERGY.COM.BR",
  };
}

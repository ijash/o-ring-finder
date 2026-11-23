import {
  FaqSection,
  FooterText,
  GoatCounter,
  InputSection,
  NavBar,
  TableSection,
  Title,
} from "components";
import { FilterContextProvider } from "contexts";

export const Main: React.FC = () => {
  return (
    <FilterContextProvider>
      <header>
        <NavBar />
        <Title />
      </header>
      <main className="container">
        <InputSection />
        <TableSection />
        <FaqSection />
      </main>
      <FooterText />
      <GoatCounter />
    </FilterContextProvider>
  );
};

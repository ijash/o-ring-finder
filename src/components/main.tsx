import {
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
    <main>
      <FilterContextProvider>
        <NavBar />
        <Title />
        <div className="container">
          <InputSection />
          <TableSection />
        </div>
        <FooterText />
      </FilterContextProvider>
      <GoatCounter />
    </main>
  );
};

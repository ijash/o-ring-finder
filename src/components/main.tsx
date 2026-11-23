import {
  FaqSection,
  FooterText,
  GoatCounter,
  InputSection,
  NavBar,
  TableSection,
  Title,
} from "components";
import { FilterContextProvider, ThemeProvider } from "contexts";

export const Main: React.FC = () => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

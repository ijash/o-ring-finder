import { DataRepresentation } from "data";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductSearch } from "./productSearch";
import RingVisualization from "./visualization";

interface ViewportDimensions {
  width: number;
  height: number;
}

const HEIGHT_TO_WIDTH_RATIO = 0.4;
const SECTION_STYLE_CLASS = "h3 text-center mt-3";

const ModalContent: React.FC<{ ringDimensions: DataRepresentation }> = ({
  ringDimensions,
}) => {
  const { t } = useTranslation("global");
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportDimensions, setViewportDimensions] = useState<ViewportDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = (w: number) => {
      if (w > 0) {
        setViewportDimensions({
          width: w,
          height: w * HEIGHT_TO_WIDTH_RATIO,
        });
      }
    };

    const initialWidth = element.clientWidth || element.getBoundingClientRect().width;
    measure(initialWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect?.width || entry.target.clientWidth;
        measure(width);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div id="modalVisualization">
        <div ref={containerRef} className={SECTION_STYLE_CLASS}>
          <h4 className="h3 text-center">{t("modal.visualization")}</h4>
          {viewportDimensions.width > 0 ? (
            <RingVisualization
              ringDimensions={ringDimensions}
              dimensions={viewportDimensions}
            />
          ) : (
            <div>{t("modal.loading")}</div>
          )}
        </div>
      </div>

      <div id="modalAttributes">
        <h4 className={SECTION_STYLE_CLASS}>{t("modal.attribute")}</h4>
        <table className="table table-hover table-striped table-sm table-responsive caption-top border border-dark">
          <thead>
            <tr>
              <th className="bg-dark text-light">{t("modal.attribute")}</th>
              <th className="bg-dark text-light">{t("modal.value")}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: t("modal.standard"), value: ringDimensions.standard },
              { label: t("modal.code"), value: ringDimensions.code },
              {
                label: t("modal.id"),
                value: `${ringDimensions.id}${ringDimensions.unit}`,
              },
              {
                label: t("modal.od"),
                value: `${ringDimensions.od}${ringDimensions.unit}`,
              },
              {
                label: t("modal.cs"),
                value: `${ringDimensions.cs}${ringDimensions.unit}`,
              },
            ].map(({ label, value }) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="modalProductFinder">
        <h4 className={SECTION_STYLE_CLASS}>{t("modal.productFinder")}</h4>
        <ProductSearch data={ringDimensions} />
      </div>
    </div>
  );
};

export default ModalContent;


import React from "react";
import { useTranslation } from "react-i18next";

export const FaqSection: React.FC = () => {
  const { t } = useTranslation("global");

  const faqItems = [
    { id: "q1", question: t("faq.q1.question"), answer: t("faq.q1.answer") },
    { id: "q2", question: t("faq.q2.question"), answer: t("faq.q2.answer") },
    { id: "q3", question: t("faq.q3.question"), answer: t("faq.q3.answer") },
    { id: "q4", question: t("faq.q4.question"), answer: t("faq.q4.answer") },
  ];

  return (
    <section aria-label={t("faq.sectionTitle")} className="my-5 text-start">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-2">{t("faq.sectionTitle")}</h2>
          <p className="text-body-secondary small mb-4">{t("faq.sectionSubtitle")}</p>
          <div className="accordion-wrapper">
            {faqItems.map((item) => (
              <details
                key={item.id}
                className="mb-3 p-3 bg-body rounded border"
              >
                <summary
                  className="fw-semibold text-primary"
                  style={{ cursor: "pointer" }}
                >
                  {item.question}
                </summary>
                <p className="mt-2 mb-0 text-body small">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

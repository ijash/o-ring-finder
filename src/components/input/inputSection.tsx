import { debounce } from "utils";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import oringSpec from "assets/img/oring-spec.jpg";

import { LabelWrapper, StandardElementProps } from "components/common";
import {
  ButtonInput,
  NumberInput,
  SelectInput,
  TextInput,
} from "components/input/formInput";
import { useFilter } from "contexts";
import { IDataFilter, MeasurementUnit } from "data";

type NumericFilterField =
  | "minId"
  | "maxId"
  | "minOd"
  | "maxOd"
  | "minCs"
  | "maxCs";

export const InputSection: React.FC<StandardElementProps> = () => {
  const { t } = useTranslation("global");

  const { filter, setFilter } = useFilter();
  const formRef = useRef<HTMLFormElement>(null);
  const pendingFilterRef = useRef<Partial<IDataFilter>>({});

  const updateContextDelay = 897; //milliseconds
  const debouncedFlush = useCallback(
    debounce(() => {
      const updates = { ...pendingFilterRef.current };
      pendingFilterRef.current = {};
      setFilter((prev) => ({
        ...prev,
        ...updates,
      }));
    }, updateContextDelay),
    [setFilter, updateContextDelay]
  );

  useEffect(() => {
    return () => {
      debouncedFlush.cancel();
    };
  }, [debouncedFlush]);

  const handleNumericFilter = (filterName: NumericFilterField) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      pendingFilterRef.current[filterName] =
        raw.trim() === "" ? undefined : Number(raw);
      debouncedFlush();
    };
  };

  const handleTextFilter = (filterName: "code") => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      pendingFilterRef.current[filterName] = event.target.value;
      debouncedFlush();
    };
  };

  const handleUnitFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = event.target.value;
    const nextUnit =
      raw === MeasurementUnit.INCH
        ? MeasurementUnit.INCH
        : MeasurementUnit.MM;
    pendingFilterRef.current.unit = nextUnit;
    debouncedFlush();
  };

  const handleClear = () => {
    debouncedFlush.cancel();
    pendingFilterRef.current = {};
    const preservedUnit = filter.unit ?? MeasurementUnit.MM;
    formRef.current?.reset();
    if (formRef.current) {
      const select = formRef.current.querySelector("select");
      if (select) {
        select.value = preservedUnit;
      }
    }
    setFilter({
      unit: preservedUnit,
    });
    window.scrollTo(0, 0);
  };

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
      <div className="row text-start">
        <div
          className="
              col-sm-4
              order-sm-last"
        >
          <img
            src={oringSpec}
            alt="O-ring Specifications"
            className="
                shadow-sm
                d-flex
                mx-auto
                rounded-3
                h-100
                "
          />
        </div>

        <div className="col-sm-4">
          <LabelWrapper label={t("inputForms.unit.label")}>
            <SelectInput
              name={t("inputForms.unit.label")}
              value={filter.unit}
              options={[
                {
                  name: t("inputForms.unit.placeholder.metric"),
                  value: MeasurementUnit.MM,
                },
                {
                  name: t("inputForms.unit.placeholder.imperial"),
                  value: MeasurementUnit.INCH,
                },
              ]}
              handleChange={handleUnitFilter}
            ></SelectInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.code.label")}>
            <TextInput
              name={t("inputForms.code.placeholder")}
              id="ringcode"
              handleChange={handleTextFilter("code")}
            ></TextInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.minId.label")}>
            <NumberInput
              name={t("inputForms.minId.placeholder")}
              id="minid"
              handleChange={handleNumericFilter("minId")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxId.label")}>
            <NumberInput
              name={t("inputForms.maxId.placeholder")}
              id="maxid"
              handleChange={handleNumericFilter("maxId")}
            ></NumberInput>
          </LabelWrapper>
        </div>

        <div className="col-sm-4">
          <LabelWrapper label={t("inputForms.minOd.label")}>
            <NumberInput
              name={t("inputForms.minOd.placeholder")}
              id="minod"
              handleChange={handleNumericFilter("minOd")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxOd.label")}>
            <NumberInput
              name={t("inputForms.maxOd.placeholder")}
              id="maxod"
              handleChange={handleNumericFilter("maxOd")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.minCs.label")}>
            <NumberInput
              name={t("inputForms.minCs.placeholder")}
              id="mincs"
              handleChange={handleNumericFilter("minCs")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxCs.label")}>
            <NumberInput
              name={t("inputForms.maxCs.placeholder")}
              id="maxcs"
              handleChange={handleNumericFilter("maxCs")}
            ></NumberInput>
          </LabelWrapper>
        </div>
      </div>
      <div className="mt-3 col-8 offset-2">
        <ButtonInput
          name="Clear"
          value={t("inputForms.clear")}
          handleChange={handleClear}
        />
      </div>
    </form>
  );
};


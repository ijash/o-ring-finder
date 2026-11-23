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

export const InputSection: React.FC<StandardElementProps> = () => {
  const { t } = useTranslation("global");

  const { setFilter } = useFilter();
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

  const isNumericField = (name: keyof IDataFilter): boolean =>
    name === "minId" ||
    name === "maxId" ||
    name === "minOd" ||
    name === "maxOd" ||
    name === "minCs" ||
    name === "maxCs";

  const handleFilter = (filterName: keyof IDataFilter) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const raw = event.target.value;
      const parsedValue = isNumericField(filterName)
        ? raw.trim() === ""
          ? undefined
          : Number(raw)
        : raw;

      pendingFilterRef.current[filterName] = parsedValue as never;
      debouncedFlush();
    };
  };

  const handleClear = () => {
    debouncedFlush.cancel();
    pendingFilterRef.current = {};
    setFilter((prev) => ({
      unit: prev.unit,
    }));
    formRef.current?.reset();
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
              handleChange={handleFilter("unit")}
            ></SelectInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.code.label")}>
            <TextInput
              name={t("inputForms.code.placeholder")}
              id="ringcode"
              handleChange={handleFilter("code")}
            ></TextInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.minId.label")}>
            <NumberInput
              name={t("inputForms.minId.placeholder")}
              id="minid"
              handleChange={handleFilter("minId")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxId.label")}>
            <NumberInput
              name={t("inputForms.maxId.placeholder")}
              id="maxid"
              handleChange={handleFilter("maxId")}
            ></NumberInput>
          </LabelWrapper>
        </div>

        <div className="col-sm-4">
          <LabelWrapper label={t("inputForms.minOd.label")}>
            <NumberInput
              name={t("inputForms.minOd.placeholder")}
              id="minod"
              handleChange={handleFilter("minOd")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxOd.label")}>
            <NumberInput
              name={t("inputForms.maxOd.placeholder")}
              id="maxod"
              handleChange={handleFilter("maxOd")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.minCs.label")}>
            <NumberInput
              name={t("inputForms.minCs.placeholder")}
              id="mincs"
              handleChange={handleFilter("minCs")}
            ></NumberInput>
          </LabelWrapper>
          <LabelWrapper label={t("inputForms.maxCs.label")}>
            <NumberInput
              name={t("inputForms.maxCs.placeholder")}
              id="maxcs"
              handleChange={handleFilter("maxCs")}
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


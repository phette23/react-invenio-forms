// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, FastField } from "formik";
import { Accordion, Container } from "semantic-ui-react";
import _omit from "lodash/omit";
import _get from "lodash/get";

export class AccordionField extends Component {
  hasError(errors, initialValues = undefined, values = undefined) {
    const { includesPaths } = this.props;
    for (const errorPath in errors) {
      for (const subPath in errors[errorPath]) {
        const path = `${errorPath}.${subPath}`;
        if (
          _get(initialValues, path, "") === _get(values, path, "") &&
          includesPaths.includes(`${errorPath}.${subPath}`)
        )
          return true;
      }
    }
    return false;
  }

  renderAccordion = (props) => {
    const {
      form: { errors, status, initialErrors, initialValues, values },
    } = props;

    // eslint-disable-next-line no-unused-vars
    const { label, children, active, ...ui } = this.props;
    const uiProps = _omit({ ...ui }, ["optimized", "includesPaths"]);
    const hasError = status
      ? this.hasError(status)
      : this.hasError(errors) || this.hasError(initialErrors, initialValues, values);
    const panels = [
      {
        key: `panel-${label}`,
        title: {
          content: label,
          icon: "angle right",
        },
        content: {
          content: <Container>{children}</Container>,
        },
      },
    ];

    const errorClass = hasError ? "error secondary" : "";

    return (
      <Accordion
        defaultActiveIndex={active ? 0 : null}
        panels={panels}
        inverted
        className={`invenio-accordion-field ${errorClass}`}
        {...uiProps}
      />
    );
  };

  render() {
    const { optimized } = this.props;

    const FormikField = optimized ? FastField : Field;
    return <FormikField name="" component={this.renderAccordion} />;
  }
}

AccordionField.propTypes = {
  active: PropTypes.bool,
  includesPaths: PropTypes.array,
  label: PropTypes.string,
  optimized: PropTypes.bool,
  children: PropTypes.node,
  ui: PropTypes.object,
};

AccordionField.defaultProps = {
  active: false,
  includesPaths: [],
  label: "",
  optimized: false,
  children: null,
  ui: null,
};

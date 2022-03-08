// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FastField } from 'formik';
import { Container, Icon, Segment } from 'semantic-ui-react';

export class AccordionField extends Component {
  constructor(props) {
    super(props);
    this.state = { active: props.active || false };
  }

  iconActive = (
    <Icon name="angle down" size="large" style={{ float: 'right' }} />
  );

  iconInactive = (
    <Icon name="angle right" size="large" style={{ float: 'right' }} />
  );

  handleClick = (showContent) => {
    this.setState({ active: !showContent });
  };

  hasError(errors) {
    const { fieldPath } = this.props;
    if (fieldPath in errors) {
      return true;
    }
    for (const errorPath in errors) {
      if (errorPath.startsWith(fieldPath)) {
        return true;
      }
    }
    return false;
  }

  renderAccordion = (props) => {
    const {
      form: { errors, status },
    } = props;
    const { ui, label, children } = this.props;
    const { active } = this.state;
    const hasError = status ? this.hasError(status) : this.hasError(errors);

    return (
      <>
        <Segment
          onClick={() => this.handleClick(active)}
          {...(hasError && { ...ui?.error })}
          {...ui?.header}
        >
          <label>{label}</label>
          <span>{active ? this.iconActive : this.iconInactive}</span>
        </Segment>
        <Container {...ui?.content}>{active && children}</Container>
      </>
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;

    const FormikField = optimized ? FastField : Field;
    return <FormikField name={fieldPath} component={this.renderAccordion} />;
  }
}

AccordionField.propTypes = {
  active: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  ui: PropTypes.shape({
    header: PropTypes.object,
    content: PropTypes.object,
    error: PropTypes.object,
  }),
  optimized: PropTypes.bool,
  children: PropTypes.node,
};

AccordionField.defaultProps = {
  active: false,
  label: '',
  required: false,
  ui: {
    error: { inverted: true, color: 'red', secondary: true },
  },
  optimized: false,
  children: null,
};

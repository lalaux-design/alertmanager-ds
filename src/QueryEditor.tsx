import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './DataSource';
import { AlertDataSourceOptions, AlertQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, AlertQuery, AlertDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, filter: event.target.value });
  };

  onReceiverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, receiver: event.target.value });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, {});
    const { filter, receiver } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={8}
          value={filter || ''}
          onChange={this.onFilterChange}
          label="Filter"
          tooltip="Comma seperated filers, in the format of key=value"
        />
        <FormField width={4} value={receiver || ''} onChange={this.onReceiverChange} label="Receiver" />
      </div>
    );
  }
}

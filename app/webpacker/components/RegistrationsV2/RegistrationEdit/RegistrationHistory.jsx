import React from 'react';
import { Header, Popup, Table } from 'semantic-ui-react';
import { getIsoDateString, getShortTimeString, getTimeWithSecondsString } from '../../../lib/utils/dates';
import { events } from '../../../lib/wca-data.js.erb';
import EventIcon from '../../wca/EventIcon';
import I18n from '../../../lib/i18n';

const formatHistoryColumn = (key, value) => {
  if (key === 'event_ids') {
    return events.official.flatMap((e) => (value.includes(e.id) ? <EventIcon key={e.id} id={e.id} style={{ cursor: 'unset' }} /> : []));
  }
  return value;
};

export default function RegistrationHistory({ history, competitorsInfo }) {
  return (
    <>
      <Header>{I18n.t('registrations.registration_history.title')}</Header>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{I18n.t('competitions.registration_v2.list.timestamp')}</Table.HeaderCell>
            <Table.HeaderCell>{I18n.t('registrations.registration_history.changes')}</Table.HeaderCell>
            <Table.HeaderCell>{I18n.t('registrations.registration_history.acting_user')}</Table.HeaderCell>
            <Table.HeaderCell>{I18n.t('registrations.registration_history.action')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {history.map((entry) => (
            <Table.Row key={entry.timestamp}>
              <Table.Cell>
                <Popup
                  content={getShortTimeString(entry.timestamp)}
                  trigger={
                    <span>{`${getIsoDateString(entry.timestamp)} ${getTimeWithSecondsString(entry.timestamp)}`}</span>
                  }
                />
              </Table.Cell>
              <Table.Cell>
                {Object.entries(entry.changed_attributes).map(
                  ([k, v]) => (
                    <span key={k}>
                      Changed
                      {' '}
                      {k}
                      {' '}
                      to
                      {' '}
                      {formatHistoryColumn(k, v)}
                      {' '}
                      <br />
                    </span>
                  ),
                )}
              </Table.Cell>
              <Table.Cell>
                {
                  competitorsInfo.find(
                    (c) => c.id === Number(entry.actor_id),
                  )?.name ?? entry.actor_id
                }
              </Table.Cell>
              <Table.Cell>{entry.action}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

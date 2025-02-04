import { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import classes from './CustomQueries.module.css';

import Modal from '../../../UI/Modal/Modal';
import Icon from '../../../UI/Icons/Icon/Icon';
import {
  Config,
  GlobalState,
  NewNotification,
  Query,
} from '../../../../interfaces';
import QueriesForm from './QueriesForm';
import { deleteQuery, createNotification } from '../../../../store/actions';
import Button from '../../../UI/Buttons/Button/Button';

interface Props {
  customQueries: Query[];
  deleteQuery: (prefix: string) => {};
  createNotification: (notification: NewNotification) => void;
  config: Config;
}

const CustomQueries = (props: Props): JSX.Element => {
  const { customQueries, deleteQuery, createNotification } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editableQuery, setEditableQuery] = useState<Query | null>(null);

  const updateHandler = (query: Query) => {
    setEditableQuery(query);
    setModalIsOpen(true);
  };

  const deleteHandler = (query: Query) => {
    const currentProvider = props.config.defaultSearchProvider;
    const isCurrent = currentProvider === query.prefix;

    if (isCurrent) {
      createNotification({
        title: 'Error',
        message: 'Cannot delete active provider',
      });
    } else if (
      window.confirm(`Are you sure you want to delete this provider?`)
    ) {
      deleteQuery(query.prefix);
    }
  };

  return (
    <Fragment>
      <Modal
        isOpen={modalIsOpen}
        setIsOpen={() => setModalIsOpen(!modalIsOpen)}
      >
        {editableQuery ? (
          <QueriesForm
            modalHandler={() => setModalIsOpen(!modalIsOpen)}
            query={editableQuery}
          />
        ) : (
          <QueriesForm modalHandler={() => setModalIsOpen(!modalIsOpen)} />
        )}
      </Modal>

      <div>
        <div className={classes.QueriesGrid}>
          {customQueries.length > 0 && (
            <Fragment>
              <span>Name</span>
              <span>Prefix</span>
              <span>Actions</span>

              <div className={classes.Separator}></div>
            </Fragment>
          )}

          {customQueries.map((q: Query, idx) => (
            <Fragment key={idx}>
              <span>{q.name}</span>
              <span>{q.prefix}</span>
              <span className={classes.ActionIcons}>
                <span onClick={() => updateHandler(q)}>
                  <Icon icon="mdiPencil" />
                </span>
                <span onClick={() => deleteHandler(q)}>
                  <Icon icon="mdiDelete" />
                </span>
              </span>
            </Fragment>
          ))}
        </div>

        <Button
          click={() => {
            setEditableQuery(null);
            setModalIsOpen(true);
          }}
        >
          Add new search provider
        </Button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: GlobalState) => {
  return {
    customQueries: state.config.customQueries,
    config: state.config.config,
  };
};

export default connect(mapStateToProps, { deleteQuery, createNotification })(
  CustomQueries
);

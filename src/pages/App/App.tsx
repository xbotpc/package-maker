/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
import cx from 'classnames';
import { FocusEvent, MouseEvent, useState } from 'react';
import ReactJson from 'react-json-view';
import { Provider } from 'react-redux';
import Button from '../../components/Button/Button';
import Entry from '../../components/Entry/Entry';
import { ReactComponent as DownArrowIcon } from '../../images/down_arrow.svg';
import store from '../../state/store';
import isEmpty from '../../utils/isEmpty';
import styles from './App.module.scss';

type ComponentType = 'entry' | 'checkbox' | 'drawer'

type Details = {
  id: string,
  displayName: string,
  type: ComponentType,
  validation: Array<string>,
  defaultValue: any,
  placeholder: any,
  value: any,
}

type FormCreator = {
  id: string;
  type: ComponentType;
  details: Array<Details>,
  showDetails?: boolean,
  displayName: string;
  defaultValue?: string | boolean | number | null;
  value?: string | boolean | number | null;
  placeholder?: string | number;
  dataObject?: string | number | any;
  validation?: Array<string>
}

const formCreatorObject: Array<FormCreator> = [
  {
    id: 'name',
    displayName: 'Name',
    type: 'entry',
    showDetails: false,
    defaultValue: '',
    details: [],
    value: '',
    dataObject: {
      description: ''
    },
  },
  {
    id: 'description',
    displayName: 'Description',
    type: 'entry',
    showDetails: false,
    defaultValue: '',
    details: [],
    value: '',
    dataObject: {
      description: ''
    },
  },
  {
    id: 'homepage',
    displayName: 'Homepage',
    type: 'entry',
    showDetails: false,
    defaultValue: '',
    details: [],
    value: '',
    dataObject: {
      homepage: ''
    }
  },
  {
    id: 'license',
    displayName: 'License',
    type: 'entry',
    showDetails: false,
    defaultValue: '',
    details: [],
    value: '',
    dataObject: {
      license: ''
    }
  },
  {
    id: 'author',
    displayName: 'Author',
    type: 'drawer',
    showDetails: false,
    defaultValue: false,
    details: [
      {
        id: 'name',
        displayName: 'Name',
        type: 'entry',
        validation: [],
        defaultValue: '',
        placeholder: "Author's Name",
        value: '',
      },
      {
        id: 'email',
        displayName: 'Email',
        type: 'entry',
        validation: ['email'],
        defaultValue: '',
        placeholder: "Author's Email ID",
        value: '',
      },
      {
        id: 'URL',
        displayName: 'URL',
        type: 'entry',
        validation: [],
        defaultValue: '',
        placeholder: "Personal Website link",
        value: '',
      }
    ],
    dataObject: {
      name: '',
      email: '',
      URL: ''
    }
  },
  {
    id: 'repo',
    displayName: 'Repository',
    type: 'drawer',
    showDetails: false,
    defaultValue: false,
    details: [
      {
        id: 'url',
        displayName: 'URL',
        type: 'entry',
        validation: [],
        defaultValue: '',
        placeholder: "Repository URL",
        value: '',
      },
      {
        id: 'type',
        displayName: 'Type',
        type: 'entry',
        validation: [],
        defaultValue: '',
        placeholder: "Repository type (GIT, SVN)",
        value: '',
      },
      {
        id: 'directory',
        displayName: 'Directory',
        type: 'entry',
        validation: [],
        defaultValue: '',
        placeholder: "Directory",
        value: '',
      },
    ],
    dataObject: {
      url: '',
      type: '',
      directory: ''
    }
  },
  // {
  //   id: 'scripts',
  //   displayName: 'Scripts',
  //   type: 'drawer',
  //   showDetails: false,
  //   defaultValue: false,
  //   details: [
  //     {
  //       id: 'url',
  //       displayName: 'URL',
  //       type: 'entry',
  //       validation: [],
  //       defaultValue: '',
  //       placeholder: "Repository URL",
  //       value: '',
  //     },
  //     {
  //       id: 'type',
  //       displayName: 'type',
  //       type: 'entry',
  //       validation: [],
  //       defaultValue: '',
  //       placeholder: "Repository type (GIT, SVN)",
  //       value: '',
  //     },
  //     {
  //       id: 'directory',
  //       displayName: 'directory',
  //       type: 'entry',
  //       validation: [],
  //       defaultValue: '',
  //       placeholder: "Directory",
  //       value: '',
  //     },
  //   ],
  //   dataObject: {
  //     url: '',
  //     type: '',
  //     directory: ''
  //   }
  // },
]

function App(): JSX.Element {
  const [finalJSON, setFinalJSON] = useState({
    name: 'my_app',
    description: '',
    version: '1.0.0',
    scripts: {
      "test": ''
    },
    keywords: [],
    license: ""
  });
  const [focusedEntry, setFocusedEntry] = useState<string>('');

  const onButtonClick = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    const _JSON = JSON.parse(JSON.stringify(finalJSON));
    const index = formCreatorObject.findIndex(x => x.id === id);
    formCreatorObject[index].showDetails = !formCreatorObject[index].showDetails;
    if (!(id in _JSON)) {
      _JSON[id] = { ...formCreatorObject[index].dataObject };
    } else {
      // delete _JSON[id];
    }
    setFinalJSON(_JSON);
  }

  const onEntryClick = (id: string, e: MouseEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    setFocusedEntry(id)
  }

  const onEntryChange = (id: string, value: string, parentID?: string) => {
    const _JSON = JSON.parse(JSON.stringify(finalJSON));
    if (parentID !== undefined) {
      const parentIndex = formCreatorObject.findIndex(x => x.id === parentID);
      const detailIndex = formCreatorObject[parentIndex]?.details?.findIndex(x => x.id === id);
      if (detailIndex !== undefined && parentIndex !== undefined) {
        const _details = formCreatorObject[parentIndex]?.details || [];
        _details[detailIndex].value = value;
      }
      _JSON[parentID][id] = value;
    } else {
      const parentIndex = formCreatorObject.findIndex(x => x.id === id);
      formCreatorObject[parentIndex].value = value;
      _JSON[id] = value;
    }
    setFinalJSON(_JSON);
  }

  const onCopyClick = () => {
    navigator.clipboard.writeText(JSON.stringify(finalJSON));
  }

  const renderForm = (data: Array<any>, parentID?: string) => {
    return data.map(({ id, type, displayName, details = [], showDetails = false, value: _value }) => {
      const form: Array<JSX.Element | null> = [];
      const key = `${id}-${parentID || 'parent'}`;
      if (type === 'drawer') {
        form.push(
          <Button styleClass={styles.drawer} id={id} key={key} onClick={onButtonClick}>
            <h3>{displayName}</h3>
            <DownArrowIcon />
          </Button>
        );
      }

      if (type === 'entry') {
        form.push(
          <Entry
            key={key}
            id={id}
            styleClass={cx(styles.formEntry, { [styles.active]: !isEmpty(_value) || focusedEntry === id })}
            onChange={(id, value) => onEntryChange(id, value, parentID)}
            onClick={(e) => onEntryClick(id, e)}
            onFocus={(e) => onEntryClick(id, e)}
            label={displayName}
          />
        );
      }

      if (Array.isArray(details)) {
        form.push(
          showDetails ? (
            <div className={styles.details}>
              <div className={styles.vertialSeparator} style={{ gridArea: `1/1/${details.length + 1}/1` }} />
              {renderForm(details, id)}
            </div>
          ) : null
        )
      }

      if (parentID === undefined) {
        return <div key={id} className={cx(styles.container, { [styles.noBorder]: isEmpty(details.length) })}>{form}</div>;
      } return form;
    })
  }

  return (
    <Provider store={store}>
      <div className={styles.split}>
        <section>
          <h1>PCKGR</h1>
          {renderForm(formCreatorObject)}
        </section>
        <div className={styles.editor}>
          <Button id={'hoverButton'} onClick={onCopyClick} styleClass={styles.clipboardHover} />
          <ReactJson
            src={finalJSON}
            key={'adada'}
            collapseStringsAfterLength={75}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            groupArraysAfterLength={5}
            indentWidth={4}
            name={null}
            style={{
              height: '100%',
              borderRadius: '8px',
              padding: '0.5rem',
              fontSize: '1rem',
            }}
            theme={'ashes'}
          />
        </div>
      </div>
    </Provider>
  );
}

export default App;

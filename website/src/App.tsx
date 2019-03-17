import React, { useState, useRef, Suspense, useEffect } from 'react';
import useForm from './src';
import { Animate } from 'react-simple-animate';
import { SubHeading, Heading } from './styles/typography';
import ButtonGroup from './ButtonGroup';
import styled from 'styled-components';
import FORM_DATA from './constants/formData';
import colors from './styles/colors';
import Home from './Home';

const Setting = React.lazy(() => import('./Setting'));
const Builder = React.lazy(() => import('./Builder'));
const Api = React.lazy(() => import('./Api'));

const Root = styled.div`
  overflow: hidden;
  color: white;
  padding: 0 20px 50px;
  position: relative;

  @media (min-width: 1024px) {
    padding: 0 50px;
  }

  & form > select,
  & form > input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    padding: 10px 15px;
    margin-bottom: 10px;
    font-size: 16px;
  }

  & form > select {
    width: 100%;
  }

  & form > select:not([multiple]) {
    height: 37px;
  }

  & form {
    flex: 1;
  }

  & form > input.form-error {
    border: 1px solid #bf1650;
  }
`;

const Footer = styled.footer`
  padding: 40px 0;
  font-size: 12px;
  font-weight: 200;

  @media (min-width: 768px) {
    font-size: 16px;
  }

  & > a {
    color: white;
    text-decoration: none;
    transition: 0.3s all;

    &:hover {
      color: ${colors.lightPink};
    }
  }
`;

const isMobile = window.matchMedia('(max-width: 768px)').matches;

function App() {
  const [submitData, updateSubmitData] = useState({});
  const settingButton = useRef(null);
  const builderButton = useRef(null);
  const apiButton = useRef(null);
  const [editFormData, setFormData] = useState({});
  const [showSetting, toggleSetting] = useState(false);
  const [showApi, toggleApi] = useState(false);
  const [showBuilder, toggleBuilder] = useState(false);
  const [formData, updateFormData] = useState(FORM_DATA);
  const [setting, setConfig] = useState<{
    mode: 'onSubmit' | 'onBlur' | 'onChange';
    showError: boolean;
    showWatch: boolean;
    showSubmit: boolean;
  }>({
    mode: 'onChange',
    showError: true,
    showWatch: true,
    showSubmit: true,
  });
  const { register, errors, handleSubmit, watch } = useForm({
    mode: setting.mode,
  });

  const onSubmit = data => {
    updateSubmitData(data);
  };

  useEffect(
    () => {
      const pathName = window.location.pathname;
      if (pathName === '/api') {
        toggleApi(true);
        toggleBuilder(false);
      } else if (pathName === '/builder') {
        toggleApi(false);
        toggleBuilder(true);
      }
    },
    [window.location.pathname],
  );

  const Buttons = (
    <ButtonGroup
      builderButton={builderButton}
      toggleBuilder={toggleBuilder}
      toggleSetting={toggleSetting}
      showSetting={showSetting}
      settingButton={settingButton}
      showBuilder={showBuilder}
      apiButton={apiButton}
      showApi={showApi}
      toggleApi={toggleApi}
    />
  );

  return (
    <Root>
      {!isMobile && Buttons}

      <Suspense fallback={<span />}>
        <Setting
          settingButton={settingButton}
          toggleSetting={toggleSetting}
          setting={setting}
          showSetting={showSetting}
          setConfig={setConfig}
        />
      </Suspense>

      <Suspense fallback={<span />}>
        <Builder
          showBuilder={showBuilder}
          toggleBuilder={toggleBuilder}
          editFormData={editFormData}
          setFormData={setFormData}
          formData={formData}
          updateFormData={updateFormData}
          builderButton={builderButton}
          isMobile={isMobile}
        />
      </Suspense>

      <Suspense fallback={<span />}>
        <Api
          showApi={showApi}
          toggleApi={toggleApi}
          editFormData={editFormData}
          setFormData={setFormData}
          formData={formData}
          updateFormData={updateFormData}
          builderButton={builderButton}
          isMobile={isMobile}
          apiButton={apiButton}
        />
      </Suspense>

      {isMobile && Buttons}

      <main
        onClick={() => {
          if (showSetting || showBuilder) {
            toggleSetting(false);
            toggleBuilder(false);
          }
        }}
        style={{
          perspective: '800px',
        }}
      >
        <Animate
          play={showBuilder || showSetting || showApi}
          startStyle={{ minHeight: '100vh', filter: 'blur(0)', transform: 'scale(1)' }}
          endStyle={{ minHeight: '100vh', filter: 'blur(3px)', transform: 'scale(0.9) rotateX(5deg)' }}
        >
          <Heading>React Forme</Heading>
          <SubHeading>Performance, flexible and extensible forms with easy to use for validation.</SubHeading>

          <Home
            {...{
              handleSubmit,
              onSubmit,
              submitData,
              register,
              errors,
              watch,
              formData,
              toggleBuilder,
              setting,
            }}
          />

          <Footer>
            Build ♡ by <a href="https://twitter.com/bluebill1049">@Bill Luo</a> with{' '}
            <a href="https://react-forme.now.sh/" target="_blank">
              React Forme
            </a>{' '}
            &{' '}
            <a href="https://react-simple-animate.now.sh/" target="_blank">
              React Simple Animate
            </a>
          </Footer>
        </Animate>
      </main>
    </Root>
  );
}

export default React.memo(App);
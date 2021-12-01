import React, { Fragment, useEffect, useState } from 'react';

import Link from 'next/link';

import { IconType } from 'react-icons/lib';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Container,
  Content,
  Divider,
  Header,
  HeaderIcon,
  Indicator,
  Info,
  Tab,
  TabContainer,
} from './styles';

import Input from '../../Input';

import { BsQuestionCircleFill } from 'react-icons/bs';

export interface ITabData {
  name: string;
  info: string | number;
  linked?: string;
}

export interface ITab {
  title: string;
  data: ITabData[];
}

export interface IToast {
  autoClose: number;
  pauseOnHover: boolean;
  closeOnClick: boolean;
}

interface IDetail {
  title: string;
  tabs: ITab[];
  Icon: IconType | undefined;
}

const Detail: React.FC<IDetail> = ({ title, tabs, Icon }) => {
  const [selectedTab, setSelectedTab] = useState<ITab>(tabs[0]);

  useEffect(() => {
    const tab = document.getElementById(
      `tab-${selectedTab.title.toLowerCase()}`,
    );
    const indicator = document.getElementById('tab-indicator');

    if (indicator && tab) {
      indicator.style.width = `${String(tab.offsetWidth)}px`;
      indicator.style.transform = `translateX(${String(tab.offsetLeft)}px)`;
    }
  }, [selectedTab]);

  const renderTabs = () =>
    tabs.map((tab, index) => {
      const id = `tab-${tab.title.toLowerCase()}`;
      const active = tab.title === selectedTab.title;
      const handleTab = () => setSelectedTab(tab);

      const props = { id, active, onClick: handleTab };

      return (
        <Tab key={String(index)} {...props}>
          {tab.title}
        </Tab>
      );
    });

  const handleCopyInfo = (info: string, data: string | number) => {
    const toastProps: IToast = {
      autoClose: 2000,
      pauseOnHover: false,
      closeOnClick: true,
    };

    navigator.clipboard.writeText(String(data));
    toast.info(`${info} copied to clipboard`, toastProps);
  };

  return (
    <Container>
      <Input />
      <Header>
        <HeaderIcon>{Icon ? <Icon /> : <BsQuestionCircleFill />}</HeaderIcon>
        <h3>{title}</h3>
      </Header>

      <Content>
        <TabContainer>
          <Indicator id="tab-indicator" />

          {renderTabs()}
        </TabContainer>
        {selectedTab.data.map((data, index) => (
          <Fragment key={String(index)}>
            <Info>
              <span>{data.name}</span>
              {data.linked ? (
                <Link href={data.linked}>{data.info}</Link>
              ) : (
                <p onClick={() => handleCopyInfo(data.name, data.info)}>
                  {data.info}
                </p>
              )}
            </Info>

            {index + 1 !== selectedTab.data.length && <Divider />}
          </Fragment>
        ))}
      </Content>
    </Container>
  );
};

export default Detail;

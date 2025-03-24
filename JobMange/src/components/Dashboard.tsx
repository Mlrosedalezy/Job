import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme, media } from '../styles/theme';
import CommunityInfo from './CommunityInfo';
import HouseDistribution from './HouseDistribution';
import ResidentDistribution from './ResidentDistribution';
import SmartEnergy from './SmartEnergy';
import Notifications from './Notifications';
import AccessControl from './AccessControl';

const DashboardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xl};
  display: grid;
  gap: ${theme.spacing.xl};
  overflow-y: auto;
  
  /* 移动端布局 */
  grid-template-columns: 1fr;
  
  /* 平板布局 */
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* 桌面布局 */
  ${media.xxl} {
    grid-template-columns: repeat(3, 1fr);
    overflow-y: hidden;
  }

  /* 处理滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borderRadius.sm};
  }
`;

const Header = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};

  @media screen and (max-width: 576px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xxl};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media screen and (max-width: 576px) {
    font-size: ${theme.fontSize.xl};
  }
`;

const DateTime = styled.div`
  @media screen and (max-width: 576px) {
    font-size: ${theme.fontSize.md};
  }
`;

const GridItem = styled.div`
  min-height: 300px;
  height: 100%;

  @media screen and (max-width: 768px) {
    min-height: 400px;
  }
`;

const Dashboard: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        <Header>
          <Title>XXXX智慧社区物业大屏</Title>
          <DateTime>
            {new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </DateTime>
        </Header>
        <GridItem>
          <CommunityInfo />
        </GridItem>
        <GridItem>
          <HouseDistribution />
        </GridItem>
        <GridItem>
          <ResidentDistribution />
        </GridItem>
        <GridItem>
          <SmartEnergy />
        </GridItem>
        <GridItem>
          <Notifications />
        </GridItem>
        <GridItem>
          <AccessControl />
        </GridItem>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard; 
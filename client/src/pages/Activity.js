import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Loader from '../components/loading/Loader';
import MOCK_TRANSACTIONS from '../data/activityTransactions';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';

const LOAD_DELAY_MS = 1500;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Main = styled.main`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 6rem 1.5rem 3rem;
`;

const ContentShell = styled.div`
  position: relative;
  min-height: 420px;
  margin-top: 1.5rem;
`;

const StateLayer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: ${fadeInUp} 280ms ease-out both;
`;

const LoadingWrapper = styled(StateLayer)`
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
`;

const TxList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid ${(props) => props.theme.colors.darkBg};
  animation: ${fadeInUp} 320ms ease-out both;
`;

const TxItem = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.25rem 1rem;
  padding: 1rem 0.25rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.darkBg};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TxLabel = styled.span`
  font-family: ${(props) => props.theme.fonts.fontFamilySansSerif};
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 0;
`;

const TxAmount = styled.span`
  font-family: ${(props) => props.theme.fonts.fontFamilySansSerif};
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) =>
    props.$positive
      ? props.theme.colors.primaryCta
      : props.theme.colors.dangerColor};
`;

const TxTimestamp = styled.time`
  grid-column: 1 / -1;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.fontColorDarkLighter};
`;

const EmptyState = styled(StateLayer)`
  align-items: center;
  text-align: center;
  padding: 4rem 0;
`;

const formatChips = (amount) =>
  `${amount > 0 ? '+' : ''}${new Intl.NumberFormat('en-US').format(amount)} chips`;

const formatTimestamp = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const isLoggedIn = (userName) =>
  Boolean(userName) || Boolean(localStorage.getItem('token'));

const Activity = () => {
  useScrollToTopOnPageLoad();
  const navigate = useNavigate();
  const { userName } = useContext(globalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!isLoggedIn(userName)) {
      navigate('/login', { replace: true });
    }
  }, [userName, navigate]);

  useEffect(() => {
    if (!isLoggedIn(userName)) return undefined;
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [userName]);

  if (!isLoggedIn(userName)) return null;

  return (
    <Container fullHeight padding="0">
      <Main aria-labelledby="activity-heading" aria-busy={isLoading}>
        <Heading as="h1" id="activity-heading" headingClass="h2">
          Player Activity
        </Heading>
        <Text>Your recent chip movements at the table.</Text>

        <ContentShell>
          {isLoading && (
            <LoadingWrapper role="status" aria-live="polite">
              <Loader />
              <Text>Loading activity…</Text>
            </LoadingWrapper>
          )}

          {!isLoading && transactions.length === 0 && (
            <EmptyState>
              <Heading as="h2" headingClass="h5">No activity yet</Heading>
              <Text>Once you play a hand, your transactions will appear here.</Text>
            </EmptyState>
          )}

          {!isLoading && transactions.length > 0 && (
            <TxList aria-label="Recent transactions">
              {transactions.map((tx) => (
                <TxItem key={tx.id}>
                  <TxLabel>{tx.label}</TxLabel>
                  <TxAmount $positive={tx.amount > 0}>
                    {formatChips(tx.amount)}
                  </TxAmount>
                  <TxTimestamp dateTime={tx.timestamp}>
                    {formatTimestamp(tx.timestamp)}
                  </TxTimestamp>
                </TxItem>
              ))}
            </TxList>
          )}
        </ContentShell>
      </Main>
    </Container>
  );
};

export default Activity;

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Loader from '../components/loading/Loader';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';
import config from '../clientConfig';

const getApiUrl = (path) => {
  const base = config.apiBaseUrl || '';
  return base ? `${base.replace(/\/$/, '')}/${path}` : `/${path}`;
};

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

const Summary = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid ${(props) => props.theme.colors.darkBg};
`;

const Balance = styled.span`
  font-family: ${(props) => props.theme.fonts.fontFamilySansSerif};
  font-size: 1.35rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primaryCta};
  white-space: nowrap;
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
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn(userName)) {
      navigate('/login', { replace: true });
    }
  }, [userName, navigate]);

  useEffect(() => {
    if (!isLoggedIn(userName)) return undefined;

    let isMounted = true;

    const loadLedger = async () => {
      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(getApiUrl('api/transaction/history'), {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!isMounted) return;

        setTransactions(data.data?.transactions || []);
        setBalance(data.data?.balance || 0);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err.response?.data?.message ||
          err.response?.data?.error?.message ||
          err.message ||
          'Unable to load player activity.';

        setError(message);
        setTransactions([]);
        setBalance(0);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLedger();

    return () => {
      isMounted = false;
    };
  }, [userName]);

  if (!isLoggedIn(userName)) return null;

  return (
    <Container fullHeight padding="0">
      <Main aria-labelledby="activity-heading" aria-busy={isLoading}>
        <Heading as="h1" id="activity-heading" headingClass="h2">
          Player Ledger
        </Heading>
        <Text>Read-only transaction history for your chip movements.</Text>

        <ContentShell>
          {isLoading && (
            <LoadingWrapper role="status" aria-live="polite">
              <Loader />
              <Text>Loading activity…</Text>
            </LoadingWrapper>
          )}

          {!isLoading && error && (
            <EmptyState role="alert">
              <Heading as="h2" headingClass="h5">Activity unavailable</Heading>
              <Text>{error}</Text>
            </EmptyState>
          )}

          {!isLoading && !error && transactions.length === 0 && (
            <EmptyState>
              <Heading as="h2" headingClass="h5">No activity yet</Heading>
              <Text>Once you play a hand, your transactions will appear here.</Text>
            </EmptyState>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <>
              <Summary aria-label="Ledger balance">
                <Text>Current ledger balance</Text>
                <Balance>{formatChips(balance)}</Balance>
              </Summary>
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
            </>
          )}
        </ContentShell>
      </Main>
    </Container>
  );
};

export default Activity;

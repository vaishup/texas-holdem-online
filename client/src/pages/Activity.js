import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Loader from '../components/loading/Loader';
import MOCK_TRANSACTIONS from '../data/activityTransactions';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';

const LOAD_DELAY_MS = 600;

const Main = styled.main`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 6rem 1.5rem 3rem;
`;

const TxList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  border-top: 1px solid ${(props) => props.theme.colors.darkBg};
`;

const TxItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 0.25rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.darkBg};
`;

const TxRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

const TxLabel = styled.span`
  font-family: ${(props) => props.theme.fonts.fontFamilySansSerif};
  font-size: 1.1rem;
  font-weight: 500;
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
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.fontColorDarkLighter};
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
`;

const EmptyState = styled.div`
  padding: 2rem 0;
  text-align: center;
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

const Activity = () => {
  useScrollToTopOnPageLoad();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container fullHeight padding="0">
      <Main aria-labelledby="activity-heading" aria-busy={isLoading}>
        <Heading as="h1" id="activity-heading" headingClass="h2">
          Player Activity
        </Heading>
        <Text>Your recent chip movements at the table.</Text>

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
                <TxRow>
                  <TxLabel>{tx.label}</TxLabel>
                  <TxAmount $positive={tx.amount > 0}>
                    {formatChips(tx.amount)}
                  </TxAmount>
                </TxRow>
                <TxTimestamp dateTime={tx.timestamp}>
                  {formatTimestamp(tx.timestamp)}
                </TxTimestamp>
              </TxItem>
            ))}
          </TxList>
        )}
      </Main>
    </Container>
  );
};

export default Activity;

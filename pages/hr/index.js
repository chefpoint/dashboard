import styles from '../../styles/dashboard/DashboardHR.module.css';
import Sidebar from '../../components/sidebar/container/Sidebar';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';
import { IconButton } from '../../components/iconButton2/IconButton';
import { Badge } from '../../components/badge/Badge';
import Button from '../../theme/components/Button';
import Table from '../../theme/components/Table';
import { Row, Col, Tooltip, User, Text, Modal, Divider, Loading, Spacer } from '@nextui-org/react';
import { AiFillStar } from 'react-icons/ai';

export default function DashboardHR() {
  //

  // Get days from API
  const { data: candidates } = useSWR('/api/candidates/*');

  async function createCandidate() {
    await fetch('/api/candidates/new', {
      method: 'POST',
      body: JSON.stringify({
        info: {
          name: { first: 'Joaquim', last: 'Almeida' },
        },
      }),
    });
  }

  // State definitions
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <Sidebar title={'Recrutamento'}>
      <div className={styles.toolbar}>
        <Button onClick={createCandidate}>Novo Candidato</Button>
      </div>
      <div className={styles.candidateList}>
        {candidates ? (
          <Table
            aria-label='Example table with static content'
            fixed
            css={{
              height: 'auto',
              minWidth: '100%',
              bc: '#ffffff',
            }}
          >
            <Table.Header>
              <Table.Column width='100%'>CANDIDATO</Table.Column>
              <Table.Column>FUNÇÕES</Table.Column>
              <Table.Column>DATA DE CANDIDATURA</Table.Column>
              <Table.Column>AÇÕES</Table.Column>
            </Table.Header>
            <Table.Body>
              {candidates.map((candidate) => (
                <Table.Row key={candidate._id}>
                  <Table.Cell>
                    <User
                      src={candidate.info.picture_url}
                      name={candidate.info.name.first + ' ' + candidate.info.name.last}
                      description={candidate.info.email}
                      css={{ p: 0, justifyContent: 'start' }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {candidate.jobs.map((job, index) => (
                      <Badge key={index}>{job}</Badge>
                    ))}
                  </Table.Cell>
                  <Table.Cell>{candidate.apply_date}</Table.Cell>
                  <Table.Cell>
                    <Row justify='center' align='center'>
                      <Col css={{ d: 'flex' }}>
                        <Tooltip content='Details'>
                          <IconButton onClick={() => console.log('View user', user.id)}>
                            <AiFillStar size={20} fill='#979797' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col css={{ d: 'flex' }}>
                        <Tooltip content='Edit user'>
                          <IconButton onClick={() => console.log('Edit user', user.id)}>
                            <AiFillStar size={20} fill='#979797' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col css={{ d: 'flex' }}>
                        <Tooltip content='Delete user' color='error' onClick={() => console.log('Delete user', user.id)}>
                          <IconButton>
                            <AiFillStar size={20} fill='#FF0080' />
                          </IconButton>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <LoadingOverlay visible={isLoading} />
        )}
      </div>
    </Sidebar>
  );
}

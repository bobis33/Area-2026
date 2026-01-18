import { useState, useEffect } from 'react';
import { FiPlus, FiTrash, FiArrowRight, FiPause, FiPlay } from 'react-icons/fi';
import { get, post, del, put } from '@/services/api';
import { getAuthToken, getUser } from '@/utils/storage';
import { ServiceIcon } from '@/components/icons';
import {
  PageLayout,
  PageHeader,
  ContentGrid,
  Card,
  Button,
  Input,
  Text,
} from '@/components/ui';
import styles from './Area.module.css';

interface Area {
  id: number;
  name: string;
  is_active: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  action: {
    id: number;
    service: string;
    type: string;
    parameters: string;
  };
  reaction: {
    id: number;
    service: string;
    type: string;
    parameters: string;
  };
}

interface ActionDefinition {
  service: string;
  type: string;
  oauth: boolean;
  parameters: string | Record<string, any>;
}

interface ReactionDefinition {
  service: string;
  type: string;
  oauth: boolean;
  parameters: string | Record<string, any>;
}

interface ParameterField {
  name: string;
  type: string;
  description: string;
  example?: string;
  optional?: boolean;
}

export default function Area() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [availableActions, setAvailableActions] = useState<ActionDefinition[]>(
    [],
  );
  const [availableReactions, setAvailableReactions] = useState<
    ReactionDefinition[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [areaName, setAreaName] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionDefinition | null>(
    null,
  );
  const [selectedReaction, setSelectedReaction] =
    useState<ReactionDefinition | null>(null);
  const [actionParams, setActionParams] = useState<Record<string, any>>({});
  const [reactionParams, setReactionParams] = useState<Record<string, any>>({});

  // Selection state
  const [selectionStep, setSelectionStep] = useState<'service' | 'item'>(
    'service',
  );
  const [selectionMode, setSelectionMode] = useState<
    'action' | 'reaction' | null
  >(null);
  const [selectedActionService, setSelectedActionService] = useState<
    string | null
  >(null);
  const [selectedReactionService, setSelectedReactionService] = useState<
    string | null
  >(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        throw new Error('Not authenticated - please login again');
      }

      const [areasData, actionsData, reactionsData] = await Promise.all([
        get<Area[]>('/areas', token),
        get<ActionDefinition[]>('/areas/actions', token),
        get<ReactionDefinition[]>('/areas/reactions', token),
      ]);

      // Normalize service and type to strings
      const normalizedActions = actionsData.map((action) => ({
        ...action,
        service: String(action.service || ''),
        type: String(action.type || ''),
      }));

      const normalizedReactions = reactionsData.map((reaction) => ({
        ...reaction,
        service: String(reaction.service || ''),
        type: String(reaction.type || ''),
      }));

      setAreas(areasData);
      setAvailableActions(normalizedActions);
      setAvailableReactions(normalizedReactions);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArea = async () => {
    if (!areaName || !selectedAction || !selectedReaction) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      const user = getUser();

      if (!token || !user) {
        throw new Error('Not authenticated');
      }

      const userId = typeof user === 'object' && 'id' in user ? user.id : null;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const payload = {
        name: areaName,
        userId: userId,
        action: {
          service: selectedAction.service,
          type: selectedAction.type,
          oauth: selectedAction.oauth,
          parameters: actionParams,
        },
        reaction: {
          service: selectedReaction.service,
          type: selectedReaction.type,
          oauth: selectedReaction.oauth,
          parameters: reactionParams,
        },
      };

      await post('/areas', payload, token);
      await loadData();
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create automation';
      setError(errorMessage);
      console.error('Error creating area:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, currentState: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await put(`/areas/${id}/activate?active=${!currentState}`, {}, token);
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update automation';
      setError(errorMessage);
      console.error('Error toggling area:', err);
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this automation?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await del(`/areas/${id}`, token);
      await loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete automation';
      setError(errorMessage);
      console.error('Error deleting area:', err);
    }
  };

  const resetForm = () => {
    setAreaName('');
    setSelectedAction(null);
    setSelectedReaction(null);
    setActionParams({});
    setReactionParams({});

    setSelectionStep('service');
    setSelectionMode(null);
    setSelectedActionService(null);
    setSelectedReactionService(null);
  };

  const openServiceSelection = (mode: 'action' | 'reaction') => {
    setSelectionMode(mode);
    setSelectionStep('service');
  };

  const handleServiceSelect = (service: string) => {
    if (selectionMode === 'action') {
      setSelectedActionService(service);
    } else {
      setSelectedReactionService(service);
    }
    setSelectionStep('item');
  };

  const handleActionSelect = (action: ActionDefinition) => {
    setSelectedAction(action);
    setActionParams({});
    setSelectionMode(null);
  };

  const handleReactionSelect = (reaction: ReactionDefinition) => {
    setSelectedReaction(reaction);
    setReactionParams({});
    setSelectionMode(null);
  };

  const parseParameters = (
    params: string | Record<string, any>,
  ): Record<string, any> => {
    if (typeof params === 'string') {
      try {
        return JSON.parse(params);
      } catch {
        return {};
      }
    }
    return params;
  };

  const getParameterFields = (
    params: string | Record<string, any>,
  ): ParameterField[] => {
    const parsed = parseParameters(params);
    return Object.entries(parsed).map(([name, config]: [string, any]) => ({
      name,
      type: config.type || 'string',
      description: config.description || '',
      example: config.example,
      optional: config.optional || false,
    }));
  };

  const groupActionsByService = () => {
    const grouped: Record<string, ActionDefinition[]> = {};
    availableActions.forEach((action) => {
      const service = String(action.service || '');
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push(action);
    });
    return grouped;
  };

  const groupReactionsByService = () => {
    const grouped: Record<string, ReactionDefinition[]> = {};
    availableReactions.forEach((reaction) => {
      const service = String(reaction.service || '');
      if (!grouped[service]) {
        grouped[service] = [];
      }
      grouped[service].push(reaction);
    });
    return grouped;
  };

  if (loading && areas.length === 0) {
    return (
      <PageLayout maxWidth="xl">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <Text variant="body" color="muted">
            Loading automations...
          </Text>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title="Your Automations"
        subtitle="Create and manage your action → reaction automations"
        action={
          <Button
            variant="primary"
            leftIcon={<FiPlus />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Automation
          </Button>
        }
      />

      {error && (
        <div className={styles.errorBanner}>
          <Text variant="body" color="danger">
            {error}
          </Text>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {areas.length === 0 ? (
        <Card padding="lg">
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPlus size={48} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text variant="subtitle">No automations yet</Text>
            </div>
            <div style={{ marginBottom: 24 }}>
              <Text variant="body" color="muted">
                Create your first automation to connect actions and reactions
              </Text>
            </div>
            <Button
              variant="primary"
              leftIcon={<FiPlus />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Your First Automation
            </Button>
          </div>
        </Card>
      ) : (
        <ContentGrid columns={2} gap="lg">
          {areas.map((area) => (
            <Card key={area.id} padding="lg" hoverable>
              <div className={styles.automationCard}>
                <div className={styles.automationHeader}>
                  <Text variant="subtitle" style={{ margin: 0 }}>
                    {area.name}
                  </Text>
                  <div className={styles.automationActions}>
                    <div
                      style={
                        {
                          padding: '4px 8px',
                          borderRadius: 8,
                          backgroundColor: area.is_active
                            ? 'var(--color-success-soft)'
                            : 'var(--color-surface-muted)',
                          color: area.is_active
                            ? 'var(--color-success)'
                            : 'var(--color-text-muted)',
                        } as React.CSSProperties
                      }
                    >
                      <Text variant="caption">
                        {area.is_active ? 'Active' : 'Inactive'}
                      </Text>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(area.id, area.is_active);
                      }}
                      style={{
                        minWidth: 32,
                        padding: 4,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text)',
                      }}
                    >
                      {area.is_active ? (
                        <FiPause size={16} />
                      ) : (
                        <FiPlay size={16} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArea(area.id);
                      }}
                      style={{
                        minWidth: 32,
                        padding: 4,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-danger)',
                      }}
                    >
                      <FiTrash size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.automationFlow}>
                  <div className={styles.flowItem}>
                    <div className={styles.flowIcon}>
                      <ServiceIcon
                        service={String(area.action?.service || '')}
                        size={32}
                      />
                    </div>
                    <div className={styles.flowContent}>
                      <Text variant="caption" color="muted">
                        Action
                      </Text>
                      <Text variant="body">
                        {String(area.action?.service || '')}.
                        {String(area.action?.type || '')}
                      </Text>
                    </div>
                  </div>

                  <div className={styles.flowArrow}>
                    <FiArrowRight />
                  </div>

                  <div className={styles.flowItem}>
                    <div className={styles.flowIcon}>
                      <ServiceIcon
                        service={area.reaction?.service || ''}
                        size={32}
                      />
                    </div>
                    <div className={styles.flowContent}>
                      <Text variant="caption" color="muted">
                        Reaction
                      </Text>
                      <Text variant="body">
                        {String(area.reaction?.service || '')}.
                        {String(area.reaction?.type || '')}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className={styles.automationFooter}>
                  <Text variant="caption" color="muted">
                    Created {new Date(area.created_at).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </ContentGrid>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <Text variant="subtitle" style={{ margin: 0 }}>
                Create New Automation
              </Text>
            </div>

            <div className={styles.modalBody}>
              <Input
                label="Automation Name"
                placeholder="e.g., Daily Discord Notification"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                fullWidth
                required
              />

              <div className={styles.formSection}>
                <div style={{ marginBottom: 8 }}>
                  <Text variant="body" style={{ fontWeight: '600' }}>
                    Action (Trigger){' '}
                    <Text variant="caption" color="danger">
                      *
                    </Text>
                  </Text>
                </div>
                {selectedAction ? (
                  <div className={styles.selectedItem}>
                    <div className={styles.selectedItemIcon}>
                      <ServiceIcon
                        service={String(selectedAction.service || '')}
                        size={32}
                      />
                    </div>
                    <div className={styles.selectedItemInfo}>
                      <Text variant="body" style={{ fontWeight: '600' }}>
                        {String(selectedAction.service || '')}
                      </Text>
                      <Text variant="caption" color="muted">
                        {String(selectedAction.type || '')}
                      </Text>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openServiceSelection('action')}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<FiPlus />}
                    onClick={() => openServiceSelection('action')}
                  >
                    Select Action
                  </Button>
                )}

                {selectedAction &&
                  getParameterFields(selectedAction.parameters).length > 0 && (
                    <div className={styles.paramsContainer}>
                      <div style={{ marginBottom: 16 }}>
                        <Text variant="body" style={{ fontWeight: '600' }}>
                          Action Parameters
                        </Text>
                      </div>
                      {getParameterFields(selectedAction.parameters).map(
                        (field) => (
                          <Input
                            key={field.name}
                            label={field.name}
                            placeholder={field.example || field.description}
                            helperText={field.description}
                            value={actionParams[field.name] || ''}
                            onChange={(e) =>
                              setActionParams({
                                ...actionParams,
                                [field.name]: e.target.value,
                              })
                            }
                            required={!field.optional}
                            fullWidth
                          />
                        ),
                      )}
                    </div>
                  )}
              </div>

              <div className={styles.formSection}>
                <div style={{ marginBottom: 8 }}>
                  <Text variant="body" style={{ fontWeight: '600' }}>
                    Reaction (Response){' '}
                    <Text variant="caption" color="danger">
                      *
                    </Text>
                  </Text>
                </div>
                {selectedReaction ? (
                  <div className={styles.selectedItem}>
                    <div className={styles.selectedItemIcon}>
                      <ServiceIcon
                        service={String(selectedReaction.service || '')}
                        size={32}
                      />
                    </div>
                    <div className={styles.selectedItemInfo}>
                      <Text variant="body" style={{ fontWeight: '600' }}>
                        {String(selectedReaction.service || '')}
                      </Text>
                      <Text variant="caption" color="muted">
                        {String(selectedReaction.type || '')}
                      </Text>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openServiceSelection('reaction')}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<FiPlus />}
                    onClick={() => openServiceSelection('reaction')}
                  >
                    Select Reaction
                  </Button>
                )}

                {selectedReaction &&
                  getParameterFields(selectedReaction.parameters).length >
                    0 && (
                    <div className={styles.paramsContainer}>
                      <div style={{ marginBottom: 16 }}>
                        <Text variant="body" style={{ fontWeight: '600' }}>
                          Reaction Parameters
                        </Text>
                      </div>
                      {getParameterFields(selectedReaction.parameters).map(
                        (field) => (
                          <Input
                            key={field.name}
                            label={field.name}
                            placeholder={field.example || field.description}
                            helperText={field.description}
                            value={reactionParams[field.name] || ''}
                            onChange={(e) =>
                              setReactionParams({
                                ...reactionParams,
                                [field.name]: e.target.value,
                              })
                            }
                            required={!field.optional}
                            fullWidth
                          />
                        ),
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateArea}
                disabled={
                  !areaName || !selectedAction || !selectedReaction || loading
                }
                loading={loading}
              >
                Create Automation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Modal */}
      {selectionMode && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectionMode(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <Text variant="subtitle" style={{ margin: 0 }}>
                {selectionStep === 'service'
                  ? `Select ${selectionMode === 'action' ? 'Action' : 'Reaction'} Service`
                  : `Select ${selectionMode === 'action' ? 'Action' : 'Reaction'}`}
              </Text>
            </div>

            <div className={styles.modalBody}>
              {selectionStep === 'service' ? (
                <div className={styles.serviceGrid}>
                  {Object.keys(
                    selectionMode === 'action'
                      ? groupActionsByService()
                      : groupReactionsByService(),
                  ).map((service) => (
                    <div
                      key={service}
                      className={styles.serviceCard}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <ServiceIcon service={String(service || '')} size={48} />
                      <Text variant="body" style={{ fontWeight: '600' }}>
                        {String(service || '')}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.itemGrid}>
                  {selectionMode === 'action' &&
                    selectedActionService &&
                    groupActionsByService()[selectedActionService]?.map(
                      (action) => (
                        <div
                          key={`${action.service}-${action.type}`}
                          className={styles.itemCard}
                          onClick={() => handleActionSelect(action)}
                        >
                          <ServiceIcon
                            service={String(action.service || '')}
                            size={32}
                          />
                          <Text variant="body" style={{ fontWeight: '600' }}>
                            {String(action.type || '')}
                          </Text>
                          <Text variant="caption" color="muted">
                            {String(action.service || '')}
                          </Text>
                        </div>
                      ),
                    )}
                  {selectionMode === 'reaction' &&
                    selectedReactionService &&
                    groupReactionsByService()[selectedReactionService]?.map(
                      (reaction) => (
                        <div
                          key={`${reaction.service}-${reaction.type}`}
                          className={styles.itemCard}
                          onClick={() => handleReactionSelect(reaction)}
                        >
                          <ServiceIcon
                            service={String(reaction.service || '')}
                            size={32}
                          />
                          <Text variant="body" style={{ fontWeight: '600' }}>
                            {String(reaction.type || '')}
                          </Text>
                          <Text variant="caption" color="muted">
                            {String(reaction.service || '')}
                          </Text>
                        </div>
                      ),
                    )}
                </div>
              )}
            </div>

            {selectionStep === 'item' && (
              <div className={styles.modalFooter}>
                <Button
                  variant="ghost"
                  onClick={() => setSelectionStep('service')}
                >
                  Back to Services
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

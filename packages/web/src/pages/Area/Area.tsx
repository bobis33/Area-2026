import { useState, useEffect } from 'react';
import {
  FiPlus,
  FiTrash,
  FiArrowRight,
  FiX,
  FiPause,
  FiPlay,
} from 'react-icons/fi';
import { get, post, del, put } from '@/services/api';
import { getAuthToken, getUser } from '@/utils/storage';
import { useTranslation } from '@/contexts/I18nContext';
import { ServiceIcon } from '@/components/icons';
import {
  PageLayout,
  PageHeader,
  ContentGrid,
  Card,
  Button,
  Input,
  ConfirmDialog,
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
  const t = useTranslation();
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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'pause' | 'resume' | null;
    areaId: number | null;
    areaName: string;
  }>({
    isOpen: false,
    type: null,
    areaId: null,
    areaName: '',
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

      setAreas(areasData);
      setAvailableActions(actionsData);
      setAvailableReactions(reactionsData);
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

  const handleDeleteArea = async (id: number) => {
    try {
      setActionLoading(id);
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await del(`/areas/${id}`, token);
      await loadData();
      setConfirmDialog({
        isOpen: false,
        type: null,
        areaId: null,
        areaName: '',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete automation';
      setError(errorMessage);
      console.error('Error deleting area:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAreaStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await put(`/areas/${id}/activate?active=${!currentStatus}`, {}, token);
      await loadData();
      setConfirmDialog({
        isOpen: false,
        type: null,
        areaId: null,
        areaName: '',
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update automation status';
      setError(errorMessage);
      console.error('Error toggling area status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const openConfirmDialog = (
    type: 'delete' | 'pause' | 'resume',
    areaId: number,
    areaName: string,
  ) => {
    setConfirmDialog({
      isOpen: true,
      type,
      areaId,
      areaName,
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.areaId === null || confirmDialog.type === null) return;

    if (confirmDialog.type === 'delete') {
      handleDeleteArea(confirmDialog.areaId);
    } else if (confirmDialog.type === 'pause') {
      const area = areas.find((a) => a.id === confirmDialog.areaId);
      if (area) {
        handleToggleAreaStatus(confirmDialog.areaId, area.is_active);
      }
    } else if (confirmDialog.type === 'resume') {
      const area = areas.find((a) => a.id === confirmDialog.areaId);
      if (area) {
        handleToggleAreaStatus(confirmDialog.areaId, area.is_active);
      }
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
      if (!grouped[action.service]) {
        grouped[action.service] = [];
      }
      grouped[action.service].push(action);
    });
    return grouped;
  };

  const groupReactionsByService = () => {
    const grouped: Record<string, ReactionDefinition[]> = {};
    availableReactions.forEach((reaction) => {
      if (!grouped[reaction.service]) {
        grouped[reaction.service] = [];
      }
      grouped[reaction.service].push(reaction);
    });
    return grouped;
  };

  if (loading && areas.length === 0) {
    return (
      <PageLayout maxWidth="xl">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>{t('common.loading')}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title={t('area.title')}
        subtitle={t('area.subtitle')}
        action={
          <Button
            variant="primary"
            leftIcon={<FiPlus />}
            onClick={() => setShowCreateModal(true)}
          >
            {t('area.createNew')}
          </Button>
        }
      />

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            {t('common.close')}
          </Button>
        </div>
      )}

      {areas.length === 0 ? (
        <Card padding="lg">
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPlus size={48} />
            </div>
            <h3 className={styles.emptyTitle}>{t('area.noAutomations')}</h3>
            <p className={styles.emptyText}>
              {t('area.noAutomationsDescription')}
            </p>
            <Button
              variant="primary"
              leftIcon={<FiPlus />}
              onClick={() => setShowCreateModal(true)}
            >
              {t('area.createNew')}
            </Button>
          </div>
        </Card>
      ) : (
        <ContentGrid columns={2} gap="lg">
          {areas.map((area) => (
            <Card key={area.id} padding="lg" hoverable>
              <div className={styles.automationCard}>
                <div className={styles.automationHeader}>
                  <h3 className={styles.automationName}>{area.name}</h3>
                  <div className={styles.automationActions}>
                    <span
                      className={`${styles.statusBadge} ${
                        area.is_active
                          ? styles.statusActive
                          : styles.statusInactive
                      }`}
                    >
                      {area.is_active ? t('area.active') : t('area.inactive')}
                    </span>
                    <div className={styles.cardActions}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirmDialog(
                            area.is_active ? 'pause' : 'resume',
                            area.id,
                            area.name,
                          );
                        }}
                        className={styles.actionButton}
                        title={
                          area.is_active
                            ? t('area.actions.pause')
                            : t('area.actions.resume')
                        }
                        disabled={actionLoading === area.id}
                      >
                        {area.is_active ? <FiPause /> : <FiPlay />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirmDialog('delete', area.id, area.name);
                        }}
                        className={styles.deleteButton}
                        title={t('area.actions.delete')}
                        disabled={actionLoading === area.id}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.automationFlow}>
                  <div className={styles.flowItem}>
                    <div className={styles.flowIcon}>
                      <ServiceIcon service={area.action.service} size={32} />
                    </div>
                    <div className={styles.flowContent}>
                      <span className={styles.flowLabel}>
                        {t('area.action')}
                      </span>
                      <p className={styles.flowText}>
                        {area.action.service}.{area.action.type}
                      </p>
                    </div>
                  </div>

                  <div className={styles.flowArrow}>
                    <FiArrowRight />
                  </div>

                  <div className={styles.flowItem}>
                    <div className={styles.flowIcon}>
                      <ServiceIcon service={area.reaction.service} size={32} />
                    </div>
                    <div className={styles.flowContent}>
                      <span className={styles.flowLabel}>
                        {t('area.reaction')}
                      </span>
                      <p className={styles.flowText}>
                        {area.reaction.service}.{area.reaction.type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.automationFooter}>
                  <span className={styles.createdDate}>
                    {t('area.createdAt')}:{' '}
                    {new Date(area.created_at).toLocaleDateString()}
                  </span>
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
              <h2 className={styles.modalTitle}>{t('createArea.title')}</h2>
              <button
                className={styles.modalClose}
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <Input
                label={t('createArea.name')}
                placeholder={t('createArea.namePlaceholder')}
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                fullWidth
                required
              />

              <div className={styles.formSection}>
                <label className={styles.formLabel}>
                  {t('createArea.action')}{' '}
                  <span className={styles.required}>*</span>
                </label>
                {selectedAction ? (
                  <div className={styles.selectedItem}>
                    <div className={styles.selectedItemIcon}>
                      <ServiceIcon service={selectedAction.service} size={32} />
                    </div>
                    <div className={styles.selectedItemInfo}>
                      <span className={styles.selectedService}>
                        {selectedAction.service}
                      </span>
                      <span className={styles.selectedType}>
                        {selectedAction.type}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openServiceSelection('action')}
                    >
                      {t('common.edit')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<FiPlus />}
                    onClick={() => openServiceSelection('action')}
                  >
                    {t('createArea.selectAction')}
                  </Button>
                )}

                {selectedAction &&
                  getParameterFields(selectedAction.parameters).length > 0 && (
                    <div className={styles.paramsContainer}>
                      <h4 className={styles.paramsTitle}>
                        {t('createArea.parameters')}
                      </h4>
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
                <label className={styles.formLabel}>
                  {t('createArea.reaction')}{' '}
                  <span className={styles.required}>*</span>
                </label>
                {selectedReaction ? (
                  <div className={styles.selectedItem}>
                    <div className={styles.selectedItemIcon}>
                      <ServiceIcon
                        service={selectedReaction.service}
                        size={32}
                      />
                    </div>
                    <div className={styles.selectedItemInfo}>
                      <span className={styles.selectedService}>
                        {selectedReaction.service}
                      </span>
                      <span className={styles.selectedType}>
                        {selectedReaction.type}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openServiceSelection('reaction')}
                    >
                      {t('common.edit')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    fullWidth
                    leftIcon={<FiPlus />}
                    onClick={() => openServiceSelection('reaction')}
                  >
                    {t('createArea.selectReaction')}
                  </Button>
                )}

                {selectedReaction &&
                  getParameterFields(selectedReaction.parameters).length >
                    0 && (
                    <div className={styles.paramsContainer}>
                      <h4 className={styles.paramsTitle}>
                        {t('createArea.parameters')}
                      </h4>
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
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateArea}
                disabled={
                  !areaName || !selectedAction || !selectedReaction || loading
                }
                loading={loading}
              >
                {t('createArea.create')}
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
              <h2 className={styles.modalTitle}>
                {selectionStep === 'service'
                  ? selectionMode === 'action'
                    ? t('createArea.selectService')
                    : t('createArea.selectService')
                  : selectionMode === 'action'
                    ? t('createArea.selectAction')
                    : t('createArea.selectReaction')}
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setSelectionMode(null)}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {selectionStep === 'service' ? (
                <div className={styles.serviceGrid}>
                  {Object.keys(
                    selectionMode === 'action'
                      ? groupActionsByService()
                      : groupReactionsByService(),
                  ).map((service) => (
                    <button
                      key={service}
                      className={styles.serviceCard}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <ServiceIcon service={service} size={48} />
                      <span className={styles.serviceName}>{service}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.itemGrid}>
                  {selectionMode === 'action' &&
                    selectedActionService &&
                    groupActionsByService()[selectedActionService]?.map(
                      (action) => (
                        <button
                          key={`${action.service}-${action.type}`}
                          className={styles.itemCard}
                          onClick={() => handleActionSelect(action)}
                        >
                          <span className={styles.itemType}>{action.type}</span>
                          <span className={styles.itemService}>
                            {action.service}
                          </span>
                        </button>
                      ),
                    )}
                  {selectionMode === 'reaction' &&
                    selectedReactionService &&
                    groupReactionsByService()[selectedReactionService]?.map(
                      (reaction) => (
                        <button
                          key={`${reaction.service}-${reaction.type}`}
                          className={styles.itemCard}
                          onClick={() => handleReactionSelect(reaction)}
                        >
                          <span className={styles.itemType}>
                            {reaction.type}
                          </span>
                          <span className={styles.itemService}>
                            {reaction.service}
                          </span>
                        </button>
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
                  {t('common.back')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({
            isOpen: false,
            type: null,
            areaId: null,
            areaName: '',
          })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.type === 'delete'
            ? t('area.deleteAutomation')
            : confirmDialog.type === 'pause'
              ? t('area.pause')
              : t('area.resume')
        }
        message={
          confirmDialog.type === 'delete'
            ? t('area.confirmations.delete', { name: confirmDialog.areaName })
            : confirmDialog.type === 'pause'
              ? t('area.confirmations.pause', { name: confirmDialog.areaName })
              : t('area.confirmations.resume', { name: confirmDialog.areaName })
        }
        confirmText={
          confirmDialog.type === 'delete'
            ? t('common.delete')
            : confirmDialog.type === 'pause'
              ? t('area.pause')
              : t('area.resume')
        }
        cancelText={t('common.cancel')}
        variant={confirmDialog.type === 'delete' ? 'danger' : 'warning'}
        loading={actionLoading !== null}
      />
    </PageLayout>
  );
}

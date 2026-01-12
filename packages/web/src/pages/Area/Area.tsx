import { useState, useEffect } from 'react';
import { get, post, del } from '@/services/api';
import { getAuthToken, getUser } from '@/utils/storage';
import { ServiceIcon, ActionReactionIcon } from '@/components/icons';
import { FaTrash } from 'react-icons/fa';
import './Area.css';

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
  parameters: string | Record<string, any>;
}

interface ReactionDefinition {
  service: string;
  type: string;
  parameters: string | Record<string, any>;
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
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Form state
  const [areaName, setAreaName] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionDefinition | null>(
    null,
  );
  const [selectedReaction, setSelectedReaction] =
    useState<ReactionDefinition | null>(null);
  const [actionParams, setActionParams] = useState<Record<string, any>>({});
  const [reactionParams, setReactionParams] = useState<Record<string, any>>({});

  // Two-step selection state
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
      const user = getUser();

      console.log('Token:', token ? 'exists' : 'null');
      console.log('User:', user);

      if (!token) {
        throw new Error('Not authenticated - please login again');
      }

      const [areasData, actionsData, reactionsData] = await Promise.all([
        get<Area[]>('/areas', token),
        get<ActionDefinition[]>('/areas/actions', token),
        get<ReactionDefinition[]>('/areas/reactions', token),
      ]);

      console.log('Areas loaded:', areasData);
      console.log('Actions loaded:', actionsData);
      console.log('Reactions loaded:', reactionsData);

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
      alert('Please fill all fields');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Get user ID from storage
      const user = getUser();
      const userId = user?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const payload = {
        name: areaName,
        userId: userId,
        action: {
          service: selectedAction.service,
          type: selectedAction.type,
          parameters: actionParams,
        },
        reaction: {
          service: selectedReaction.service,
          type: selectedReaction.type,
          parameters: reactionParams,
        },
      };

      console.log('Creating area with payload:', payload);
      console.log('Action params:', actionParams);
      console.log('Reaction params:', reactionParams);

      await post('/areas', payload, token);

      alert('Area created successfully!');
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create area';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteArea = async (areaId: number) => {
    if (!window.confirm('Are you sure you want to delete this area?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      await del(`/areas/${areaId}`, token);
      alert('Area deleted successfully!');
      loadData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete area';
      alert(`Error: ${errorMessage}`);
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
    } else if (selectionMode === 'reaction') {
      setSelectedReactionService(service);
    }
    setSelectionStep('item');
  };

  const handleActionSelect = (action: ActionDefinition) => {
    setSelectedAction(action);
    setActionParams({});
    setSelectionMode(null);
    setSelectionStep('service');
  };

  const handleReactionSelect = (reaction: ReactionDefinition) => {
    setSelectedReaction(reaction);
    setReactionParams({});
    setSelectionMode(null);
    setSelectionStep('service');
  };

  const goBackToServiceSelection = () => {
    setSelectionStep('service');
    if (selectionMode === 'action') {
      setSelectedActionService(null);
    } else if (selectionMode === 'reaction') {
      setSelectedReactionService(null);
    }
  };

  const parseParameters = (paramsString: string) => {
    try {
      return JSON.parse(paramsString);
    } catch {
      return {};
    }
  };

  const getParameterFields = (parametersStr: string | object) => {
    try {
      // If parametersStr is already an object, use it directly
      const params =
        typeof parametersStr === 'string'
          ? JSON.parse(parametersStr)
          : parametersStr;

      return Object.entries(params).map(([key, value]: [string, any]) => ({
        name: key,
        type: value.type || 'string',
        description: value.description || '',
        example: value.example || '',
        optional: value.optional || false,
      }));
    } catch {
      return [];
    }
  };

  // Group actions by service
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

  // Group reactions by service
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

  return (
    <div className="area-container">
      <div className="area-content">
        <header className="area-header">
          <h1 className="area-title">Your Automations</h1>
          <p className="area-subtitle">
            Create and manage your action → reaction automations
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-create-area"
          >
            + Create New Automation
          </button>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading automations...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <p className="error-text">❌ {error}</p>
            <button onClick={loadData} className="btn-retry">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && areas.length === 0 && (
          <div className="empty-container">
            <p className="empty-text">
              No automations yet. Create your first one!
            </p>
          </div>
        )}

        {!loading && !error && areas.length > 0 && (
          <section className="area-section">
            <h2 className="section-title">Your Automations</h2>
            <div className="automations-list">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="automation-card"
                  onClick={() => setSelectedArea(area)}
                >
                  <div className="automation-header">
                    <h3 className="automation-name">{area.name}</h3>
                    <div className="automation-actions">
                      <span
                        className={`status-badge ${area.is_active ? 'status-active' : 'status-inactive'}`}
                      >
                        {area.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteArea(area.id);
                        }}
                        className="btn-delete-area"
                        title="Delete automation"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="automation-flow">
                    <div className="flow-item">
                      <span className="flow-label">Action</span>
                      <p className="flow-text">
                        {area.action.service}.{area.action.type}
                      </p>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item">
                      <span className="flow-label">Reaction</span>
                      <p className="flow-text">
                        {area.reaction.service}.{area.reaction.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Create Area Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowCreateModal(false);
            resetForm();
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Automation</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-section">
                <label className="form-label">Automation Name</label>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="e.g., Daily Discord Notification"
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Select Action (Trigger)</label>
                {selectedAction ? (
                  <div className="selected-item-display">
                    <div className="selected-item-icon">
                      <ServiceIcon service={selectedAction.service} size={28} />
                    </div>
                    <div className="selected-item-info">
                      <span className="selected-service">
                        {selectedAction.service}
                      </span>
                      <span className="selected-type">
                        {selectedAction.type}
                      </span>
                    </div>
                    <button
                      onClick={() => openServiceSelection('action')}
                      className="btn-change"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openServiceSelection('action')}
                    className="btn-select-service"
                  >
                    + Select Action
                  </button>
                )}

                {selectedAction && (
                  <div className="params-container">
                    <h4 className="params-title">Action Parameters</h4>
                    {getParameterFields(selectedAction.parameters).map(
                      (field) => (
                        <div key={field.name} className="param-field">
                          <label className="param-label">
                            {field.name}{' '}
                            {!field.optional && (
                              <span className="required">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={actionParams[field.name] || ''}
                            onChange={(e) =>
                              setActionParams({
                                ...actionParams,
                                [field.name]: e.target.value,
                              })
                            }
                            placeholder={field.example || field.description}
                            className="param-input"
                          />
                          <small className="param-description">
                            {field.description}
                          </small>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="form-section">
                <label className="form-label">Select Reaction (Response)</label>
                {selectedReaction ? (
                  <div className="selected-item-display">
                    <div className="selected-item-icon">
                      <ServiceIcon
                        service={selectedReaction.service}
                        size={28}
                      />
                    </div>
                    <div className="selected-item-info">
                      <span className="selected-service">
                        {selectedReaction.service}
                      </span>
                      <span className="selected-type">
                        {selectedReaction.type}
                      </span>
                    </div>
                    <button
                      onClick={() => openServiceSelection('reaction')}
                      className="btn-change"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openServiceSelection('reaction')}
                    className="btn-select-service"
                  >
                    + Select Reaction
                  </button>
                )}

                {selectedReaction && (
                  <div className="params-container">
                    <h4 className="params-title">Reaction Parameters</h4>
                    {getParameterFields(selectedReaction.parameters).map(
                      (field) => (
                        <div key={field.name} className="param-field">
                          <label className="param-label">
                            {field.name}{' '}
                            {!field.optional && (
                              <span className="required">*</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={reactionParams[field.name] || ''}
                            onChange={(e) =>
                              setReactionParams({
                                ...reactionParams,
                                [field.name]: e.target.value,
                              })
                            }
                            placeholder={field.example || field.description}
                            className="param-input"
                          />
                          <small className="param-description">
                            {field.description}
                          </small>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleCreateArea} className="btn-submit">
                  Create Automation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Area Details Modal */}
      {selectedArea && (
        <div className="modal-overlay" onClick={() => setSelectedArea(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedArea.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedArea(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <label className="modal-label">Status</label>
                <span
                  className={`status-badge ${selectedArea.is_active ? 'status-active' : 'status-inactive'}`}
                >
                  {selectedArea.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="modal-section">
                <label className="modal-label">Action Service</label>
                <p className="modal-value">{selectedArea.action.service}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Action Type</label>
                <p className="modal-value">{selectedArea.action.type}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Action Parameters</label>
                <pre className="modal-code">
                  {JSON.stringify(
                    parseParameters(selectedArea.action.parameters),
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div className="modal-section">
                <label className="modal-label">Reaction Service</label>
                <p className="modal-value">{selectedArea.reaction.service}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Reaction Type</label>
                <p className="modal-value">{selectedArea.reaction.type}</p>
              </div>
              <div className="modal-section">
                <label className="modal-label">Reaction Parameters</label>
                <pre className="modal-code">
                  {JSON.stringify(
                    parseParameters(selectedArea.reaction.parameters),
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div className="modal-section">
                <label className="modal-label">Created At</label>
                <p className="modal-value">
                  {new Date(selectedArea.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Selection Modal */}
      {selectionMode && (
        <div className="modal-overlay" onClick={() => setSelectionMode(null)}>
          <div
            className="modal-content selection-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {selectionStep === 'service'
                  ? `Select ${selectionMode === 'action' ? 'Action' : 'Reaction'} Service`
                  : selectionStep === 'item' && selectionMode === 'action'
                    ? `Select Action from ${selectedActionService ? selectedActionService.charAt(0).toUpperCase() + selectedActionService.slice(1) : ''}`
                    : `Select Reaction from ${selectedReactionService ? selectedReactionService.charAt(0).toUpperCase() + selectedReactionService.slice(1) : ''}`}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setSelectionMode(null);
                  setSelectionStep('service');
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {selectionStep === 'service' && (
                <div className="selection-services-grid">
                  {Object.entries(
                    selectionMode === 'action'
                      ? groupActionsByService()
                      : groupReactionsByService(),
                  ).map(([service, items]) => (
                    <div
                      key={service}
                      className="selection-service-card"
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="service-icon">
                        <ServiceIcon service={service} size={32} />
                      </div>
                      <h3 className="service-name">
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </h3>
                      <p className="service-count">
                        {items.length}{' '}
                        {selectionMode === 'action' ? 'action' : 'reaction'}
                        {items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectionStep === 'item' && (
                <>
                  <button
                    onClick={goBackToServiceSelection}
                    className="btn-back"
                  >
                    ← Back to Services
                  </button>
                  <div className="items-list">
                    {selectionMode === 'action' &&
                      selectedActionService &&
                      groupActionsByService()[selectedActionService]?.map(
                        (action) => (
                          <div
                            key={`${action.service}.${action.type}`}
                            className="item-card"
                            onClick={() => handleActionSelect(action)}
                          >
                            <div className="item-header">
                              <div className="item-icon">
                                <ActionReactionIcon
                                  type={action.type}
                                  size={24}
                                />
                              </div>
                              <h4 className="item-name">{action.type}</h4>
                            </div>
                            <p className="item-description">
                              {typeof action.parameters === 'string'
                                ? `Parameters: ${action.parameters}`
                                : Object.keys(
                                      typeof action.parameters === 'object'
                                        ? action.parameters
                                        : {},
                                    ).length > 0
                                  ? `${Object.keys(typeof action.parameters === 'object' ? action.parameters : {}).length} parameter(s) required`
                                  : 'No parameters required'}
                            </p>
                          </div>
                        ),
                      )}
                    {selectionMode === 'reaction' &&
                      selectedReactionService &&
                      groupReactionsByService()[selectedReactionService]?.map(
                        (reaction) => (
                          <div
                            key={`${reaction.service}.${reaction.type}`}
                            className="item-card"
                            onClick={() => handleReactionSelect(reaction)}
                          >
                            <div className="item-header">
                              <div className="item-icon">
                                <ActionReactionIcon
                                  type={reaction.type}
                                  size={24}
                                />
                              </div>
                              <h4 className="item-name">{reaction.type}</h4>
                            </div>
                            <p className="item-description">
                              {typeof reaction.parameters === 'string'
                                ? `Parameters: ${reaction.parameters}`
                                : Object.keys(
                                      typeof reaction.parameters === 'object'
                                        ? reaction.parameters
                                        : {},
                                    ).length > 0
                                  ? `${Object.keys(typeof reaction.parameters === 'object' ? reaction.parameters : {}).length} parameter(s) required`
                                  : 'No parameters required'}
                            </p>
                          </div>
                        ),
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

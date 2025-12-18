import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import {
  AreaActionDefinition,
  AreaReactionDefinition,
} from '@/types/api';
import {
  makeKey,
  safeService,
  safeType,
  groupActionsByService,
  groupReactionsByService,
  getAllServices,
  validateParams,
} from '@/utils/areaHelpers';

export type SelectionKind = 'action' | 'reaction';
export type ModalStep = 'service' | 'action' | 'reaction';

interface UseAreaCreationReturn {
  // Data
  loading: boolean;
  submitting: boolean;
  actions: AreaActionDefinition[];
  reactions: AreaReactionDefinition[];
  actionsByService: Record<string, AreaActionDefinition[]>;
  reactionsByService: Record<string, AreaReactionDefinition[]>;
  services: string[];
  
  // Selection state
  selectedActionKey: string;
  selectedReactionKey: string;
  selectedAction: AreaActionDefinition | undefined;
  selectedReaction: AreaReactionDefinition | undefined;
  
  // Parameters
  actionParams: Record<string, any>;
  reactionParams: Record<string, any>;
  setActionParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setReactionParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  
  // Form state
  name: string;
  setName: (name: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  
  // Modal state
  modalOpen: boolean;
  modalStep: ModalStep;
  selectionKind: SelectionKind;
  selectedActionService: string | null;
  selectedReactionService: string | null;
  
  // Actions
  openModal: (kind: SelectionKind) => void;
  closeModal: () => void;
  goBackToService: () => void;
  handleServiceSelect: (service: string) => void;
  handleActionSelect: (action: AreaActionDefinition) => void;
  handleReactionSelect: (reaction: AreaReactionDefinition) => void;
  setParamValue: (kind: 'action' | 'reaction', key: string, fieldType: string, rawValue: any) => void;
  handleSubmit: () => Promise<void>;
}

export function useAreaCreation(): UseAreaCreationReturn {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [actions, setActions] = useState<AreaActionDefinition[]>([]);
  const [reactions, setReactions] = useState<AreaReactionDefinition[]>([]);
  const [selectedActionKey, setSelectedActionKey] = useState<string>('');
  const [selectedReactionKey, setSelectedReactionKey] = useState<string>('');
  const [actionParams, setActionParams] = useState<Record<string, any>>({});
  const [reactionParams, setReactionParams] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('service');
  const [selectionKind, setSelectionKind] = useState<SelectionKind>('action');
  const [selectedActionService, setSelectedActionService] = useState<string | null>(null);
  const [selectedReactionService, setSelectedReactionService] = useState<string | null>(null);
  const [previousAutoName, setPreviousAutoName] = useState<string>('');

  // Derived data structures
  const actionsByService = useMemo(
    () => groupActionsByService(actions),
    [actions],
  );

  const reactionsByService = useMemo(
    () => groupReactionsByService(reactions),
    [reactions],
  );

  const services = useMemo(
    () => getAllServices(actionsByService, reactionsByService),
    [actionsByService, reactionsByService],
  );

  const selectedAction = useMemo(() => {
    return actions.find(a => makeKey(a.service, a.type) === selectedActionKey);
  }, [actions, selectedActionKey]);

  const selectedReaction = useMemo(() => {
    return reactions.find(r => makeKey(r.service, r.type) === selectedReactionKey);
  }, [reactions, selectedReactionKey]);

  // Load actions and reactions
  useEffect(() => {
    const run = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const [a, r] = await Promise.all([
          apiService.getAreaActions(token),
          apiService.getAreaReactions(token),
        ]);
        setActions(a);
        setReactions(r);
      } catch (e) {
        // Failed to load actions/reactions
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  // Reset params and apply defaults when action changes
  useEffect(() => {
    setActionParams({});
    if (selectedAction) {
      const actionKey = makeKey(selectedAction.service, selectedAction.type);
      if (actionKey === 'time.cron') {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris';
        setActionParams({
          cron: '*/1 * * * *',
          timezone,
        });
      }
    }
  }, [selectedActionKey, selectedAction]);

  // Reset params when reaction changes
  useEffect(() => {
    setReactionParams({});
  }, [selectedReactionKey]);

  // Auto-generate name when both action and reaction are selected
  useEffect(() => {
    if (selectedAction && selectedReaction) {
      const actionKey = makeKey(selectedAction.service, selectedAction.type);
      const reactionKey = makeKey(selectedReaction.service, selectedReaction.type);
      const autoName = `${actionKey} → ${reactionKey}`;

      // Only update if name is empty or matches previous auto-name
      if (!name.trim() || name === previousAutoName) {
        setName(autoName);
        setPreviousAutoName(autoName);
      }
    }
  }, [selectedAction, selectedReaction, name, previousAutoName]);

  const openModal = (kind: SelectionKind) => {
    setSelectionKind(kind);
    setModalStep('service');
    if (kind === 'action') {
      setSelectedActionService(null);
    } else {
      setSelectedReactionService(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalStep('service');
  };

  const goBackToService = () => {
    setModalStep('service');
  };

  const handleServiceSelect = (service: string) => {
    if (selectionKind === 'action') {
      setSelectedActionService(service);
      setModalStep('action');
    } else {
      setSelectedReactionService(service);
      setModalStep('reaction');
    }
  };

  const handleActionSelect = (action: AreaActionDefinition) => {
    const key = makeKey(action.service, action.type);
    setSelectedActionKey(key);
    closeModal();
  };

  const handleReactionSelect = (reaction: AreaReactionDefinition) => {
    const key = makeKey(reaction.service, reaction.type);
    setSelectedReactionKey(key);
    closeModal();
  };

  const setParamValue = (
    kind: 'action' | 'reaction',
    key: string,
    fieldType: string,
    rawValue: any,
  ) => {
    const nextValue =
      fieldType === 'number'
        ? (rawValue === '' ? '' : Number(rawValue))
        : fieldType === 'boolean'
          ? Boolean(rawValue)
          : rawValue;

    if (kind === 'action') {
      setActionParams(prev => ({ ...prev, [key]: nextValue }));
    } else {
      setReactionParams(prev => ({ ...prev, [key]: nextValue }));
    }
  };

  const handleSubmit = async () => {
    if (!token || !user) return;

    const finalName = name.trim() || (selectedAction && selectedReaction
      ? `${makeKey(selectedAction.service, selectedAction.type)} → ${makeKey(selectedReaction.service, selectedReaction.type)}`
      : '');

    if (!finalName) {
      return;
    }

    if (!selectedAction || !selectedReaction) {
      return;
    }

    // Validate required parameters
    const actionParamsValid = validateParams(selectedAction.parameters as any, actionParams);
    const reactionParamsValid = validateParams(selectedReaction.parameters as any, reactionParams);

    if (!actionParamsValid || !reactionParamsValid) {
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createArea(
        {
          name: finalName,
          userId: user.id,
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
          is_active: isActive,
        },
        token,
      );
      router.back();
    } catch (e) {
      // Failed to create area
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Data
    loading,
    submitting,
    actions,
    reactions,
    actionsByService,
    reactionsByService,
    services,
    
    // Selection state
    selectedActionKey,
    selectedReactionKey,
    selectedAction,
    selectedReaction,
    
    // Parameters
    actionParams,
    reactionParams,
    setActionParams,
    setReactionParams,
    
    // Form state
    name,
    setName,
    isActive,
    setIsActive,
    
    // Modal state
    modalOpen,
    modalStep,
    selectionKind,
    selectedActionService,
    selectedReactionService,
    
    // Actions
    openModal,
    closeModal,
    goBackToService,
    handleServiceSelect,
    handleActionSelect,
    handleReactionSelect,
    setParamValue,
    handleSubmit,
  };
}



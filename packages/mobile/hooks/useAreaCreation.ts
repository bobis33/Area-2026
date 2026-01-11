import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { apiService } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import { AreaActionDefinition, AreaReactionDefinition } from '@/types/api';
import {
  makeKey,
  groupActionsByService,
  groupReactionsByService,
  getAllServices,
  validateParams,
  isParamObject,
} from '@/utils/areaHelpers';

export type SelectionKind = 'action' | 'reaction';
export type ModalStep = 'service' | 'action' | 'reaction';

interface UseAreaCreationReturn {
  loading: boolean;
  submitting: boolean;
  actions: AreaActionDefinition[];
  reactions: AreaReactionDefinition[];
  actionsByService: Record<string, AreaActionDefinition[]>;
  reactionsByService: Record<string, AreaReactionDefinition[]>;
  services: string[];
  availableProviders: string[];
  selectedActionKey: string;
  selectedReactionKey: string;
  selectedAction: AreaActionDefinition | undefined;
  selectedReaction: AreaReactionDefinition | undefined;
  actionParams: Record<string, any>;
  reactionParams: Record<string, any>;
  setActionParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setReactionParams: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  name: string;
  setName: (name: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  modalOpen: boolean;
  modalStep: ModalStep;
  selectionKind: SelectionKind;
  selectedActionService: string | null;
  selectedReactionService: string | null;
  openModal: (kind: SelectionKind) => void;
  closeModal: () => void;
  goBackToService: () => void;
  handleServiceSelect: (service: string) => void;
  handleActionSelect: (action: AreaActionDefinition) => void;
  handleReactionSelect: (reaction: AreaReactionDefinition) => void;
  setParamValue: (
    kind: 'action' | 'reaction',
    key: string,
    fieldType: string,
    rawValue: any,
  ) => void;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('service');
  const [selectionKind, setSelectionKind] = useState<SelectionKind>('action');
  const [selectedActionService, setSelectedActionService] = useState<
    string | null
  >(null);
  const [selectedReactionService, setSelectedReactionService] = useState<
    string | null
  >(null);
  const [previousAutoName, setPreviousAutoName] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await apiService.getOAuthProviders();
        setAvailableProviders(providers.map((p) => String(p).toLowerCase()));
      } catch (error) {
        setAvailableProviders([]);
      }
    };
    loadProviders();
  }, []);

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
    return actions.find(
      (a) => makeKey(a.service, a.type) === selectedActionKey,
    );
  }, [actions, selectedActionKey]);

  const selectedReaction = useMemo(() => {
    return reactions.find(
      (r) => makeKey(r.service, r.type) === selectedReactionKey,
    );
  }, [reactions, selectedReactionKey]);

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
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  useEffect(() => {
    setActionParams({});
    if (selectedAction) {
      const actionKey = makeKey(selectedAction.service, selectedAction.type);
      if (actionKey === 'time.cron') {
        const timezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris';
        setActionParams({
          cron: '*/1 * * * *',
          timezone,
        });
      }
    }
  }, [selectedActionKey, selectedAction]);

  useEffect(() => {
    setReactionParams({});
  }, [selectedReactionKey]);

  useEffect(() => {
    if (selectedAction && selectedReaction) {
      const actionKey = makeKey(selectedAction.service, selectedAction.type);
      const reactionKey = makeKey(
        selectedReaction.service,
        selectedReaction.type,
      );
      const autoName = `${actionKey} → ${reactionKey}`;
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
        ? rawValue === ''
          ? ''
          : Number(rawValue)
        : fieldType === 'boolean'
          ? Boolean(rawValue)
          : rawValue;

    if (kind === 'action') {
      setActionParams((prev) => ({ ...prev, [key]: nextValue }));
    } else {
      setReactionParams((prev) => ({ ...prev, [key]: nextValue }));
    }
  };

  const handleSubmit = async () => {
    if (!token || !user) return;

    const finalName =
      name.trim() ||
      (selectedAction && selectedReaction
        ? `${makeKey(selectedAction.service, selectedAction.type)} → ${makeKey(selectedReaction.service, selectedReaction.type)}`
        : '');

    if (!finalName) {
      return;
    }

    if (!selectedAction || !selectedReaction) {
      return;
    }
    const actionParamsValid = validateParams(
      selectedAction.parameters as any,
      actionParams,
    );
    const reactionParamsValid = validateParams(
      selectedReaction.parameters as any,
      reactionParams,
    );

    if (!actionParamsValid) {
      const missingParams: string[] = [];
      if (isParamObject(selectedAction.parameters)) {
        Object.entries(selectedAction.parameters).forEach(([key, field]) => {
          if (
            field.optional !== true &&
            (actionParams[key] === undefined || actionParams[key] === '')
          ) {
            missingParams.push(key);
          }
        });
      }
      Alert.alert(
        'Paramètres manquants',
        `Veuillez remplir tous les paramètres requis pour l'action : ${missingParams.join(', ')}`,
      );
      return;
    }

    if (!reactionParamsValid) {
      const missingParams: string[] = [];
      if (isParamObject(selectedReaction.parameters)) {
        Object.entries(selectedReaction.parameters).forEach(([key, field]) => {
          if (
            field.optional !== true &&
            (reactionParams[key] === undefined || reactionParams[key] === '')
          ) {
            missingParams.push(key);
          }
        });
      }
      Alert.alert(
        'Paramètres manquants',
        `Veuillez remplir tous les paramètres requis pour la réaction : ${missingParams.join(', ')}`,
      );
      return;
    }

    try {
      setSubmitting(true);

      // Filter out empty string values from parameters, but keep at least an empty object
      const cleanActionParams =
        Object.keys(actionParams).length > 0
          ? Object.fromEntries(
              Object.entries(actionParams).filter(
                ([_, v]) => v !== '' && v !== undefined,
              ),
            )
          : {};
      const cleanReactionParams =
        Object.keys(reactionParams).length > 0
          ? Object.fromEntries(
              Object.entries(reactionParams).filter(
                ([_, v]) => v !== '' && v !== undefined,
              ),
            )
          : {};

      await apiService.createArea(
        {
          name: finalName,
          userId: user.id,
          action: {
            service: selectedAction.service,
            type: selectedAction.type,
            parameters: cleanActionParams,
          },
          reaction: {
            service: selectedReaction.service,
            type: selectedReaction.type,
            parameters: cleanReactionParams,
          },
        },
        token,
      );
      router.back();
    } catch (e: any) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Erreur lors de la création de l'automatisation";
      Alert.alert('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    actions,
    reactions,
    actionsByService,
    reactionsByService,
    services,
    availableProviders,
    selectedActionKey,
    selectedReactionKey,
    selectedAction,
    selectedReaction,
    actionParams,
    reactionParams,
    setActionParams,
    setReactionParams,
    name,
    setName,
    isActive,
    setIsActive,
    modalOpen,
    modalStep,
    selectionKind,
    selectedActionService,
    selectedReactionService,
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

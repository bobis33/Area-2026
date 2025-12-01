import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@area/ui';
import { MobileScreen } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { Modal } from '@/components/layout/Modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { AnimatedCard, FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';

interface Service {
  id: string;
  name: string;
  serviceKey: 'discord' | 'github' | 'google' | 'spotify';
  connected: boolean;
}

interface Automation {
  id: string;
  name: string;
  action: string;
  reaction: string;
  actionService: string;
  reactionService: string;
  status: 'active' | 'inactive';
}

const mockServices: Service[] = [
  { id: '1', name: 'Discord', serviceKey: 'discord', connected: true },
  { id: '2', name: 'GitHub', serviceKey: 'github', connected: true },
  { id: '3', name: 'Google', serviceKey: 'google', connected: false },
  { id: '4', name: 'Spotify', serviceKey: 'spotify', connected: false },
];

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'GitHub → Discord',
    action: 'When I push to GitHub',
    reaction: 'Send a message on Discord',
    actionService: 'GitHub',
    reactionService: 'Discord',
    status: 'active',
  },
  {
    id: '2',
    name: 'Follower → Sheets',
    action: 'When I get a new follower',
    reaction: 'Add a row in Google Sheets',
    actionService: 'GitHub',
    reactionService: 'Google',
    status: 'inactive',
  },
];

export default function AreaScreen() {
  const { currentTheme } = useAppTheme();
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      {/* Header */}
      <FadeInView delay={0} spring>
        <View style={styles.header}>
          <Text variant="title" style={styles.title}>
            Your automations
          </Text>
          <Text variant="body" color="muted" style={styles.subtitle}>
            Services, actions & reactions connected to your account.
          </Text>
        </View>
      </FadeInView>

      {/* Connected Services Section */}
      <FadeInView delay={100} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Connected services
          </Text>
          <View style={styles.servicesList}>
            {mockServices.map((service, index) => (
              <FadeInView key={service.id} delay={150 + index * 50} spring>
                <AnimatedCard haptic>
                  <SectionCard>
                    <TouchableOpacity style={styles.serviceRow} activeOpacity={0.7}>
                      <View style={styles.serviceLeft}>
                        <View style={[styles.serviceIconContainer, { backgroundColor: currentTheme.colors.surfaceMuted }]}>
                          <ServiceIcon
                            service={service.serviceKey}
                            size={24}
                            color={service.connected ? currentTheme.colors.primary : currentTheme.colors.textMuted}
                          />
                        </View>
                        <Text variant="body" style={styles.serviceName}>
                          {service.name}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          service.connected
                            ? { backgroundColor: currentTheme.colors.successSoft }
                            : { backgroundColor: currentTheme.colors.surfaceMuted },
                        ]}>
                        <View
                          style={[
                            styles.statusDot,
                            service.connected
                              ? { backgroundColor: currentTheme.colors.success }
                              : { backgroundColor: currentTheme.colors.textMuted },
                          ]}
                        />
                        <Text variant="caption" style={styles.statusText}>
                          {service.connected ? 'Connected' : 'Not connected'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </SectionCard>
                </AnimatedCard>
              </FadeInView>
            ))}
          </View>
        </View>
      </FadeInView>

      {/* Scenarios Section */}
      <FadeInView delay={400} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Scenarios (Actions → Reactions)
          </Text>
          <View style={styles.automationsList}>
            {mockAutomations.map((automation, index) => (
              <FadeInView key={automation.id} delay={450 + index * 100} spring>
                <AnimatedCard
                  haptic
                  onPress={() => setSelectedAutomation(automation)}>
                  <SectionCard>
                    <View style={styles.automationRow}>
                      <View style={styles.automationHeader}>
                        <Text variant="body" style={styles.automationName}>
                          {automation.name}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            automation.status === 'active'
                              ? { backgroundColor: currentTheme.colors.successSoft }
                              : { backgroundColor: currentTheme.colors.surfaceMuted },
                          ]}>
                          <Text variant="caption" style={styles.statusText}>
                            {automation.status === 'active' ? 'Active' : 'Inactive'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.automationFlow}>
                        <View style={styles.flowItem}>
                          <Text variant="caption" color="muted">
                            Action
                          </Text>
                          <Text variant="body" style={styles.flowText}>
                            {automation.action}
                          </Text>
                        </View>
                        <IconSymbol
                          size={20}
                          name="arrow.right"
                          color={currentTheme.colors.textMuted}
                        />
                        <View style={styles.flowItem}>
                          <Text variant="caption" color="muted">
                            Reaction
                          </Text>
                          <Text variant="body" style={styles.flowText}>
                            {automation.reaction}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </SectionCard>
                </AnimatedCard>
              </FadeInView>
            ))}
          </View>
        </View>
      </FadeInView>

      {/* Automation Details Modal */}
      <Modal
        visible={!!selectedAutomation}
        onClose={() => setSelectedAutomation(null)}
        title={selectedAutomation?.name}>
        {selectedAutomation && (
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Action Service
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.actionService}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Action Description
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.action}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Reaction Service
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.reactionService}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Reaction Description
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.reaction}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Status
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  selectedAutomation.status === 'active'
                    ? { backgroundColor: currentTheme.colors.successSoft }
                    : { backgroundColor: currentTheme.colors.surfaceMuted },
                ]}>
                <Text variant="caption" style={styles.statusText}>
                  {selectedAutomation.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  servicesList: {
    gap: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  serviceName: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  automationsList: {
    gap: 12,
  },
  automationRow: {
    gap: 12,
  },
  automationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  automationName: {
    fontWeight: '600',
    flex: 1,
  },
  automationFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  flowItem: {
    flex: 1,
    minWidth: 120,
    gap: 4,
  },
  flowText: {
    fontSize: 14,
  },
  modalContent: {
    gap: 12,
  },
  modalSection: {
    gap: 4,
  },
  modalLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  modalValue: {
    marginTop: 4,
  },
});

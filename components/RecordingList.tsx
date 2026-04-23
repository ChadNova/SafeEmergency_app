/**
 * RecordingList.tsx
 *
 * Scrollable list of saved recordings. Each item shows:
 * - Name (editable inline), duration, date
 * - Play / Pause / Stop controls with a seek bar
 * - Delete button with confirmation
 */

import {
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
export interface SavedRecording {
  id: string;
  name: string;
  uri: string;
  createdAt: string;
  duration: number;
}

export interface PlaybackState {
  isPlaying: boolean;
  isBuffering: boolean;
  isLoaded: boolean;
  currentTime: number;
  duration?: number;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecordingListProps {
  recordings: SavedRecording[];
  isLoading: boolean;
  playingUri: string | null;
  playbackState: PlaybackState;
  onPlay: (uri: string) => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (seconds: number) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRefresh: () => void;
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Seek Bar ─────────────────────────────────────────────────────────────────

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

const SeekBar: React.FC<SeekBarProps> = ({ currentTime, duration, onSeek }) => {
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const [barWidth, setBarWidth] = useState(0);

  const handlePress = (e: { nativeEvent: { locationX: number } }) => {
    if (barWidth === 0 || duration === 0) return;
    const ratio = Math.max(0, Math.min(e.nativeEvent.locationX / barWidth, 1));
    onSeek(ratio * duration);
  };

  return (
    <View style={seekStyles.container}>
      <Text style={seekStyles.time}>{formatDuration(currentTime)}</Text>
      <TouchableOpacity
        activeOpacity={1}
        style={seekStyles.trackWrapper}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={handlePress}
        accessibilityLabel="Seek bar"
        accessibilityRole="adjustable"
      >
        <View style={seekStyles.track}>
          <View style={[seekStyles.fill, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>
        <View style={[seekStyles.thumb, { left: `${progress * 100}%` as any }]} />
      </TouchableOpacity>
      <Text style={seekStyles.time}>{formatDuration(duration)}</Text>
    </View>
  );
};

const seekStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  trackWrapper: {
    flex: 1,
    height: 28,
    justifyContent: "center",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    flexDirection: "row",
    overflow: "hidden",
  },
  fill: {
    backgroundColor: "#10b981",
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#059669",
    top: 7,
    marginLeft: -7,
  },
  time: {
    fontSize: 11,
    color: "#9ca3af",
    fontVariant: ["tabular-nums"],
    minWidth: 36,
  },
});

// ─── Recording Item ──────────────────────────────────────────────────────────

interface ItemProps {
  item: SavedRecording;
  isActive: boolean;
  playbackState: PlaybackState;
  onPlay: (uri: string) => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (seconds: number) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const RecordingItem: React.FC<ItemProps> = ({
  item,
  isActive,
  playbackState,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onDelete,
  onRename,
}) => {
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const expandAnim = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    expandAnim.value = withTiming(isActive ? 1 : 0, { duration: 280 });
  }, [isActive, expandAnim]);

  const expandStyle = useAnimatedStyle(() => ({
    maxHeight: expandAnim.value * 120,
    opacity: expandAnim.value,
    overflow: "hidden",
  }));

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Recording",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item.id),
        },
      ]
    );
  }, [item.id, item.name, onDelete]);

  const handleRenameConfirm = useCallback(() => {
    if (draftName.trim()) {
      onRename(item.id, draftName.trim());
    }
    setRenameModalVisible(false);
  }, [draftName, item.id, onRename]);

  const handlePlayPress = useCallback(() => {
    if (isActive && playbackState.isPlaying) {
      onPause();
    } else {
      onPlay(item.uri);
    }
  }, [isActive, playbackState.isPlaying, onPlay, onPause, item.uri]);

  return (
    <View style={itemStyles.card}>
      {/* Header row */}
      <View style={itemStyles.header}>
        <View style={itemStyles.info}>
          <TouchableOpacity
            onPress={() => {
              setDraftName(item.name);
              setRenameModalVisible(true);
            }}
            style={itemStyles.nameRow}
            accessibilityLabel={`Rename ${item.name}`}
          >
            <Text style={itemStyles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Feather name="edit-2" size={13} color="#9ca3af" />
          </TouchableOpacity>
          <Text style={itemStyles.meta}>
            {formatDate(item.createdAt)} · {formatDuration(item.duration)}
          </Text>
        </View>

        <View style={itemStyles.actions}>
          {/* Play/Pause */}
          <TouchableOpacity
            onPress={handlePlayPress}
            style={[itemStyles.playBtn, isActive && itemStyles.playBtnActive]}
            accessibilityLabel={
              isActive && playbackState.isPlaying ? "Pause" : "Play"
            }
            accessibilityRole="button"
          >
            <FontAwesome5
              name={
                isActive && playbackState.isPlaying
                  ? "pause"
                  : "play"
              }
              size={14}
              color="#fff"
              style={!isActive || !playbackState.isPlaying ? { marginLeft: 2 } : undefined}
            />
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            onPress={handleDelete}
            style={itemStyles.deleteBtn}
            accessibilityLabel={`Delete ${item.name}`}
            accessibilityRole="button"
          >
            <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded playback controls */}
      <Reanimated.View style={expandStyle}>
        {isActive && (
          <View style={itemStyles.playbackExpanded}>
            {playbackState.isBuffering && !playbackState.isLoaded && (
              <ActivityIndicator
                size="small"
                color="#10b981"
                style={{ marginBottom: 6 }}
              />
            )}
            <SeekBar
              currentTime={playbackState.currentTime}
              duration={playbackState.duration || item.duration}
              onSeek={onSeek}
            />
            <View style={itemStyles.controlsRow}>
              <TouchableOpacity
                onPress={onStop}
                style={itemStyles.ctrlBtn}
                accessibilityLabel="Stop"
              >
                <FontAwesome5 name="stop" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Reanimated.View>

      {/* Rename Modal */}
      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={renameStyles.overlay}>
          <View style={renameStyles.dialog}>
            <Text style={renameStyles.title}>Rename Recording</Text>
            <TextInput
              style={renameStyles.input}
              value={draftName}
              onChangeText={setDraftName}
              autoFocus
              selectTextOnFocus
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={handleRenameConfirm}
              accessibilityLabel="New name input"
            />
            <View style={renameStyles.btnRow}>
              <TouchableOpacity
                onPress={() => setRenameModalVisible(false)}
                style={renameStyles.cancelBtn}
              >
                <Text style={renameStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRenameConfirm}
                style={renameStyles.confirmBtn}
              >
                <Text style={renameStyles.confirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  meta: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnActive: {
    backgroundColor: "#059669",
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  playbackExpanded: {
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 16,
  },
  ctrlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
});

const renameStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    fontSize: 15,
    padding: 12,
    color: "#111827",
    marginBottom: 20,
    backgroundColor: "#f9fafb",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});

// ─── Main List ────────────────────────────────────────────────────────────────

export const RecordingList: React.FC<RecordingListProps> = ({
  recordings,
  isLoading,
  playingUri,
  playbackState,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onDelete,
  onRename,
  onRefresh,
}) => {
  const renderItem: ListRenderItem<SavedRecording> = useCallback(
    ({ item }) => (
      <RecordingItem
        key={item.id}
        item={item}
        isActive={playingUri === item.uri}
        playbackState={playbackState}
        onPlay={onPlay}
        onPause={onPause}
        onStop={onStop}
        onSeek={onSeek}
        onDelete={onDelete}
        onRename={onRename}
      />
    ),
    [playingUri, playbackState, onPlay, onPause, onStop, onSeek, onDelete, onRename]
  );

  if (isLoading) {
    return (
      <View style={listStyles.centered}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (recordings.length === 0) {
    return (
      <View style={listStyles.empty}>
        <FontAwesome5 name="microphone-slash" size={40} color="#d1d5db" />
        <Text style={listStyles.emptyTitle}>No recordings yet</Text>
        <Text style={listStyles.emptySubtitle}>
          Hold the button above to record your first clip
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onRefresh={onRefresh}
      refreshing={isLoading}
      contentContainerStyle={listStyles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const listStyles = StyleSheet.create({
  list: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9ca3af",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    maxWidth: 260,
  },
});

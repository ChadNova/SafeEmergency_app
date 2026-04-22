/**
 * RecordButton.tsx
 *
 * Press-and-hold button that triggers recording. Provides rich visual feedback:
 * - Idle: static mic icon
 * - Recording: animated pulsing ring + live duration counter
 * - Saving: spinner overlay
 */

import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecordButtonProps {
  isRecording: boolean;
  isSaving: boolean;
  duration: number; // seconds
  onPressIn: () => void;
  onPressOut: () => void;
  disabled?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const remaining = s % 60;
  return `${String(m).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isSaving,
  duration,
  onPressIn,
  onPressOut,
  disabled = false,
}) => {
  // Pulse animation
  const pulse = useSharedValue(1);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const rippleOpacity1 = useSharedValue(0);
  const rippleOpacity2 = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      // Button pulse
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
      // Ripple 1
      ripple1.value = 0;
      rippleOpacity1.value = 0.5;
      ripple1.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
      rippleOpacity1.value = withRepeat(
        withTiming(0, { duration: 1400 }),
        -1,
        false
      );
      // Ripple 2 (offset)
      ripple2.value = 0;
      rippleOpacity2.value = 0.4;
      setTimeout(() => {
        ripple2.value = withRepeat(
          withTiming(1, { duration: 1400 }),
          -1,
          false
        );
        rippleOpacity2.value = withRepeat(
          withTiming(0, { duration: 1400 }),
          -1,
          false
        );
      }, 700);
    } else {
      pulse.value = withTiming(1, { duration: 300 });
      ripple1.value = withTiming(0, { duration: 300 });
      ripple2.value = withTiming(0, { duration: 300 });
      rippleOpacity1.value = withTiming(0, { duration: 300 });
      rippleOpacity2.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording, pulse, ripple1, ripple2, rippleOpacity1, rippleOpacity2]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const RIPPLE_BASE = 90;

  const rippleStyle1 = useAnimatedStyle(() => ({
    width: RIPPLE_BASE + ripple1.value * 80,
    height: RIPPLE_BASE + ripple1.value * 80,
    borderRadius: (RIPPLE_BASE + ripple1.value * 80) / 2,
    opacity: rippleOpacity1.value,
    top: -(ripple1.value * 40),
    left: -(ripple1.value * 40),
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    width: RIPPLE_BASE + ripple2.value * 80,
    height: RIPPLE_BASE + ripple2.value * 80,
    borderRadius: (RIPPLE_BASE + ripple2.value * 80) / 2,
    opacity: rippleOpacity2.value,
    top: -(ripple2.value * 40),
    left: -(ripple2.value * 40),
  }));

  return (
    <View style={styles.container} accessibilityLabel="Hold to Record button">
      {/* Ripple rings */}
      {isRecording && (
        <>
          <Reanimated.View
            style={[styles.ripple, rippleStyle1]}
            pointerEvents="none"
          />
          <Reanimated.View
            style={[styles.ripple, rippleStyle2]}
            pointerEvents="none"
          />
        </>
      )}

      {/* Outer button */}
      <Reanimated.View style={btnStyle}>
        <Reanimated.View
          style={[
            styles.outerRing,
            isRecording && styles.outerRingActive,
            disabled && styles.disabled,
          ]}
          onTouchStart={disabled ? undefined : onPressIn}
          onTouchEnd={disabled ? undefined : onPressOut}
        >
          <View
            style={[
              styles.innerCircle,
              isRecording && styles.innerCircleActive,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <FontAwesome5
                name={isRecording ? "stop" : "microphone"}
                size={isRecording ? 32 : 36}
                color="#fff"
              />
            )}
          </View>
        </Reanimated.View>
      </Reanimated.View>

      {/* Duration / label */}
      <View style={styles.labelContainer}>
        {isRecording ? (
          <View style={styles.durationRow}>
            <View style={styles.recordDot} />
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        ) : (
          <Text style={styles.holdLabel}>
            {isSaving ? "Saving…" : "Hold to Record"}
          </Text>
        )}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const BUTTON_SIZE = 90;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    backgroundColor: "#ef4444",
    zIndex: 0,
  },
  outerRing: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 2,
  },
  outerRingActive: {
    backgroundColor: "#b91c1c",
    shadowColor: "#b91c1c",
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 18,
  },
  innerCircle: {
    width: BUTTON_SIZE - 12,
    height: BUTTON_SIZE - 12,
    borderRadius: (BUTTON_SIZE - 12) / 2,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  innerCircleActive: {
    backgroundColor: "#dc2626",
  },
  disabled: {
    opacity: 0.45,
  },
  labelContainer: {
    marginTop: 20,
    minHeight: 26,
    alignItems: "center",
  },
  holdLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: 0.3,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
  },
  durationText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },
});

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [percentage, setPercentage] = useState("");
  const [isTaiwanMode, setIsTaiwanMode] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const calculateResults = () => {
    const price = parseFloat(originalPrice);
    const percent = parseFloat(percentage);

    if (
      isNaN(price) ||
      isNaN(percent) ||
      price <= 0 ||
      percent < 0 ||
      percent > 100
    ) {
      return { finalPrice: 0, discountAmount: 0, isValid: false };
    }

    let finalPrice: number;
    let discountAmount: number;

    if (isTaiwanMode) {
      // Taiwan mode: percentage means what you pay
      finalPrice = (price * percent) / 100;
      discountAmount = price - finalPrice;
    } else {
      // International mode: percentage means discount
      discountAmount = (price * percent) / 100;
      finalPrice = price - discountAmount;
    }

    return { finalPrice, discountAmount, isValid: true };
  };

  const { finalPrice, discountAmount, isValid } = calculateResults();

  const clearInputs = () => {
    setOriginalPrice("");
    setPercentage("");
  };

  const showModeInfo = () => {
    const message = isTaiwanMode
      ? "Taiwan Mode: The percentage represents what you pay.\nExample: 65% means you pay 65% of the original price (35% discount)."
      : "International Mode: The percentage represents the discount.\nExample: 65% means 65% off (you pay 35% of the original price).";

    Alert.alert("Mode Information", message);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Discount Calculator
          </ThemedText>

          {/* Mode Toggle */}
          <ThemedView style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeToggle,
                {
                  borderColor: tintColor,
                },
              ]}
              onPress={() => setIsTaiwanMode(!isTaiwanMode)}
            >
              <ThemedText
                style={[
                  styles.modeToggleText,
                  { color: isTaiwanMode ? tintColor : "green" },
                ]}
              >
                {isTaiwanMode ? "Taiwan Mode" : "International Mode"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={showModeInfo} style={styles.infoButton}>
              <ThemedText style={[styles.infoText, { color: tintColor }]}>
                ℹ️
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Input Section */}
        <ThemedView style={styles.inputSection}>
          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Original Price ($)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: tintColor,
                  color: textColor,
                  backgroundColor: backgroundColor,
                },
              ]}
              value={originalPrice}
              onChangeText={setOriginalPrice}
              placeholder="Enter original price"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Percentage (%)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: tintColor,
                  color: textColor,
                  backgroundColor: backgroundColor,
                },
              ]}
              value={percentage}
              onChangeText={setPercentage}
              placeholder="Enter percentage"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </ThemedView>

          <TouchableOpacity
            style={[styles.clearButton, { borderColor: "#ff6b6b" }]}
            onPress={clearInputs}
          >
            <ThemedText style={[styles.clearButtonText, { color: "#ff6b6b" }]}>
              Clear
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Results Section */}
        {isValid && originalPrice && percentage && (
          <ThemedView
            style={[styles.resultsSection, { borderColor: tintColor }]}
          >
            <ThemedText type="subtitle" style={styles.resultsTitle}>
              Results
            </ThemedText>

            <ThemedView style={styles.resultRow}>
              <ThemedText type="defaultSemiBold">Original Price:</ThemedText>
              <ThemedText type="defaultSemiBold">
                ${parseFloat(originalPrice).toFixed(2)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.resultRow}>
              <ThemedText type="defaultSemiBold">
                {isTaiwanMode ? "You Pay:" : "Discount:"}
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                {isTaiwanMode ? `${percentage}%` : `${percentage}% off`}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.resultRow}>
              <ThemedText type="defaultSemiBold">Discount Amount:</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: "#ff6b6b" }}>
                -${discountAmount.toFixed(2)}
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.resultRow, styles.finalPriceRow]}>
              <ThemedText type="title" style={styles.finalPriceLabel}>
                Final Price:
              </ThemedText>
              <ThemedText
                type="title"
                style={[styles.finalPrice, { color: tintColor }]}
              >
                ${finalPrice.toFixed(2)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Error Message */}
        {originalPrice && percentage && !isValid && (
          <ThemedView style={[styles.errorSection, { borderColor: "#ff6b6b" }]}>
            <ThemedText style={{ color: "#ff6b6b" }}>
              Please enter valid values (price {">"} 0, percentage 0-100)
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  modeLabel: {
    textAlign: "center",
  },
  infoButton: {
    padding: 5,
  },
  infoText: {
    fontSize: 18,
  },
  modeToggle: {
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modeToggleText: {
    fontWeight: "600",
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: {
    fontWeight: "600",
  },
  resultsSection: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    textAlign: "center",
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  finalPriceRow: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  finalPriceLabel: {
    fontSize: 20,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  errorSection: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
});

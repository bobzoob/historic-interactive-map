// src/utils/filterUtils.ts

import type { HistoricalFeature } from "../types/geojson";
import type { TimeRange, SearchState } from "../App";

/**
 * Filters a feature based on the timeline range.
 */
const filterByTime = (
  feature: HistoricalFeature,
  timeRange: TimeRange
): boolean => {
  const featureStartYear = new Date(feature.properties.startDate).getFullYear();
  const featureEndYear = new Date(feature.properties.endDate).getFullYear();
  const [selectedStartYear, selectedEndYear] = timeRange;

  return (
    featureStartYear <= selectedEndYear && featureEndYear >= selectedStartYear
  );
};

/**
 * Filters a feature based on the search criteria for the "letters" layer.
 * This can be expanded with different logic for different layer types.
 */
const filterBySearch = (
  feature: HistoricalFeature,
  searchState: SearchState
): boolean => {
  const { plainText, sender, recipient } = searchState;
  const props = feature.properties;

  // Normalize search terms for case-insensitive matching
  const plainTextLower = plainText.toLowerCase();
  const senderLower = sender.toLowerCase();
  const recipientLower = recipient.toLowerCase();

  // Check plain text search (searches across multiple fields)
  if (plainTextLower) {
    const inSender = props.sender?.toLowerCase().includes(plainTextLower);
    const inRecipient = props.recipient?.toLowerCase().includes(plainTextLower);
    const inDescription = props.description
      ?.toLowerCase()
      .includes(plainTextLower);
    // If plainText is present, at least one field must match
    if (!(inSender || inRecipient || inDescription)) {
      return false;
    }
  }

  // Check sender-specific search
  if (senderLower && !props.sender?.toLowerCase().includes(senderLower)) {
    return false;
  }

  // Check recipient-specific search
  if (
    recipientLower &&
    !props.recipient?.toLowerCase().includes(recipientLower)
  ) {
    return false;
  }

  // If all checks pass, the feature is a match
  return true;
};

/**
 * Main filter function that applies all relevant filters to a feature.
 */
export const applyFilters = (
  feature: HistoricalFeature,
  timeRange: TimeRange,
  searchState?: SearchState
): boolean => {
  // A feature must always be within the time range
  if (!filterByTime(feature, timeRange)) {
    return false;
  }

  // If a search is active for this layer, apply search filters
  if (searchState) {
    if (!filterBySearch(feature, searchState)) {
      return false;
    }
  }

  // If the feature has passed all applicable filters, include it
  return true;
};

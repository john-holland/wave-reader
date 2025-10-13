#!/bin/bash

# Soak Test Runner Script
# This script makes it easy to run soak tests with different configurations

set -e

# Default values
DURATION=${SOAK_DURATION:-60000}  # 60 seconds default
INTERVAL=${SNAPSHOT_INTERVAL:-5000}  # 5 seconds default
THRESHOLD=${LEAK_THRESHOLD:-20}  # 20% default

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--duration)
      DURATION="$2"
      shift 2
      ;;
    -i|--interval)
      INTERVAL="$2"
      shift 2
      ;;
    -t|--threshold)
      THRESHOLD="$2"
      shift 2
      ;;
    --quick)
      DURATION=30000
      INTERVAL=2000
      shift
      ;;
    --medium)
      DURATION=300000  # 5 minutes
      INTERVAL=10000
      shift
      ;;
    --long)
      DURATION=1800000  # 30 minutes
      INTERVAL=30000
      shift
      ;;
    --stress)
      DURATION=3600000  # 1 hour
      INTERVAL=60000
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  -d, --duration MILLISECONDS    Test duration in milliseconds (default: 60000)"
      echo "  -i, --interval MILLISECONDS    Snapshot interval in milliseconds (default: 5000)"
      echo "  -t, --threshold PERCENTAGE     Memory leak threshold percentage (default: 20)"
      echo ""
      echo "Presets:"
      echo "  --quick                        Quick test: 30s duration, 2s interval"
      echo "  --medium                       Medium test: 5min duration, 10s interval"
      echo "  --long                         Long test: 30min duration, 30s interval"
      echo "  --stress                       Stress test: 1hr duration, 1min interval"
      echo ""
      echo "  -h, --help                     Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0 --quick                     # Run a quick 30-second test"
      echo "  $0 --medium                    # Run a 5-minute test"
      echo "  $0 -d 120000 -i 10000          # Run for 2 minutes with 10s snapshots"
      echo "  $0 --long -t 30                # Run 30-minute test with 30% leak threshold"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Use -h or --help for usage information"
      exit 1
      ;;
  esac
done

# Convert milliseconds to human-readable format
format_duration() {
  local ms=$1
  local seconds=$((ms / 1000))
  local minutes=$((seconds / 60))
  local hours=$((minutes / 60))
  
  if [ $hours -gt 0 ]; then
    echo "${hours}h $((minutes % 60))m"
  elif [ $minutes -gt 0 ]; then
    echo "${minutes}m $((seconds % 60))s"
  else
    echo "${seconds}s"
  fi
}

# Display configuration
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           🌊 Wave Reader Soak Test Configuration 🌊            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Test Duration:${NC}        $(format_duration $DURATION) (${DURATION}ms)"
echo -e "${GREEN}Snapshot Interval:${NC}    $(format_duration $INTERVAL) (${INTERVAL}ms)"
echo -e "${GREEN}Leak Threshold:${NC}       ${THRESHOLD}%"
echo -e "${GREEN}Expected Snapshots:${NC}   ~$((DURATION / INTERVAL))"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the test early${NC}"
echo ""

# Set environment variables
export SOAK_DURATION=$DURATION
export SNAPSHOT_INTERVAL=$INTERVAL
export LEAK_THRESHOLD=$THRESHOLD

# Run the test
echo -e "${BLUE}Starting soak test...${NC}"
echo ""

# Run playwright test with the soak test file
npx playwright test test/playwright/soak-test-memory.test.ts --project=chromium

# Check exit code
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                  ✅ Soak Test Completed Successfully ✅          ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║                     ❌ Soak Test Failed ❌                      ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
fi

echo ""
echo -e "${BLUE}📊 Reports are saved in: test-results/soak-tests/${NC}"
echo ""

exit $EXIT_CODE



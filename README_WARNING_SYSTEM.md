# 🚨 Warning System - Bash Script

A comprehensive bash script for displaying warnings and notifications, specifically designed for interview monitoring systems with phone detection warnings and performance tracking.

## ✨ Features

- **📱 Phone Detection Warnings**: Multi-level warning system with countdown timers
- **📊 Performance Monitoring**: Real-time performance metrics with visual progress bars
- **🖥️ System Status**: Comprehensive system health monitoring
- **🎨 Color-coded Output**: Beautiful terminal interface with emojis and colors
- **🔊 Audio Alerts**: Warning sounds (when supported)
- **⚡ Real-time Updates**: Live countdown and status updates

## 🚀 Quick Start

### 1. Make Scripts Executable
```bash
chmod +x warning_system.sh
chmod +x demo_warnings.sh
```

### 2. Run Demo
```bash
./demo_warnings.sh
```

### 3. Use Individual Commands
```bash
# Show phone detection warning with countdown
./warning_system.sh phone 0 10

# Show performance metrics
./warning_system.sh performance 85 72 90

# Show system status
./warning_system.sh status

# Show help
./warning_system.sh help
```

## 📱 Phone Detection Warnings

### Warning Levels
- **Level 0**: Phone detected, countdown to first warning
- **Level 1**: First warning (after 10 seconds)
- **Level 2**: Second warning (after 4 seconds)
- **Level 3**: Third warning (after 4 seconds)
- **Level 4**: Final warning (after 4 seconds) → Interview terminated

### Usage Examples
```bash
# Phone just detected, 10-second countdown
./warning_system.sh phone 0 10

# First warning issued
./warning_system.sh phone 1

# Second warning issued
./warning_system.sh phone 2

# Final warning
./warning_system.sh phone 4
```

## 📊 Performance Monitoring

### Metrics Displayed
- **Confidence Score**: Blue progress bar
- **Engagement Score**: Green progress bar  
- **Attentiveness Score**: Purple progress bar
- **Overall Performance**: Calculated average with status

### Usage Examples
```bash
# Show performance with default scores
./warning_system.sh performance

# Show performance with custom scores
./warning_system.sh performance 90 85 88

# Show performance needing improvement
./warning_system.sh performance 65 58 72
```

## 🖥️ System Status

Displays comprehensive system information:
- Camera and detection systems status
- AI Avatar and lip-sync status
- Performance monitoring status
- System time and uptime

```bash
./warning_system.sh status
```

## 🎭 Demo Scenarios

The demo script (`demo_warnings.sh`) showcases:

1. **Phone Detection Flow**: Complete warning progression
2. **Performance Monitoring**: Various performance levels
3. **System Status**: Full system overview
4. **Live Countdown**: Real-time countdown simulation

## 🎨 Visual Features

### Color Scheme
- **🔴 Red**: High/Critical warnings
- **🟠 Orange**: Medium warnings
- **🟡 Yellow**: Low warnings
- **🔵 Blue**: Information and confidence
- **🟢 Green**: Success and engagement
- **🟣 Purple**: Attentiveness and performance
- **🔵 Cyan**: Headers and system info
- **⚪ White**: Status and time

### Progress Bars
- **Filled**: █ (solid blocks)
- **Empty**: ░ (light blocks)
- **Width**: 30 characters
- **Percentage**: Displayed on the right

## 🔧 Customization

### Warning Intervals
You can modify the warning timing in the script:
```bash
# In phone_detection_warning function
# First warning: 10 seconds
# Subsequent warnings: 4 seconds
# Cooldown periods: 4-8 seconds
```

### Colors
Customize colors by modifying the color variables:
```bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
# ... etc
```

### Audio Alerts
The script attempts to play sounds using:
- `beep` command (if available)
- `paplay` (PulseAudio)
- Falls back gracefully if no audio support

## 📋 Requirements

### System Requirements
- **Bash**: Version 4.0 or higher
- **Terminal**: Supports ANSI color codes
- **Audio**: Optional (beep or PulseAudio)

### Optional Dependencies
```bash
# Install beep for audio alerts (Ubuntu/Debian)
sudo apt-get install beep

# Install beep for audio alerts (CentOS/RHEL)
sudo yum install beep
```

## 🚨 Use Cases

### Interview Monitoring
- Phone detection warnings
- Performance tracking
- System status monitoring

### System Administration
- Service status monitoring
- Performance metrics
- Alert systems

### Development
- Debug information display
- Progress tracking
- Status reporting

## 🔍 Troubleshooting

### Common Issues

1. **Colors not displaying**
   - Ensure terminal supports ANSI colors
   - Check if `TERM` variable is set correctly

2. **Audio not working**
   - Install `beep` package
   - Check PulseAudio configuration
   - Script continues without audio

3. **Permission denied**
   - Make script executable: `chmod +x warning_system.sh`
   - Check file ownership

### Debug Mode
Add debug information by modifying the script:
```bash
# Add debug logging
echo "DEBUG: $variable" >&2
```

## 📚 Examples

### Complete Phone Detection Flow
```bash
# 1. Phone detected
./warning_system.sh phone 0 10

# 2. First warning
./warning_system.sh phone 1

# 3. Second warning  
./warning_system.sh phone 2

# 4. Third warning
./warning_system.sh phone 3

# 5. Final warning
./warning_system.sh phone 4
```

### Performance Monitoring
```bash
# Excellent performance
./warning_system.sh performance 95 92 88

# Good performance
./warning_system.sh performance 78 75 82

# Needs improvement
./warning_system.sh performance 62 58 65
```

## 🤝 Contributing

Feel free to enhance the script with:
- Additional warning types
- More performance metrics
- Enhanced audio support
- Additional visual elements
- Integration with monitoring systems

## 📄 License

This script is provided as-is for educational and practical use. Feel free to modify and distribute as needed.

## 🎯 Future Enhancements

- **Web Interface**: HTML-based dashboard
- **Database Integration**: Store warning history
- **Email Alerts**: Send notifications via email
- **API Integration**: REST API for external systems
- **Mobile App**: Mobile notification support
- **Machine Learning**: Predictive warning system

---

**Happy Warning! 🚨✨**


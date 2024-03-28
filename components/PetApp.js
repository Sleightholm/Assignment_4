import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Vibration,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Assuming you have this library
import styles from "../styles/styles";
import { Audio } from "expo-av";
import Meow from "../assets/meow.mp3";

const PetApp = () => {
  const [inventory, setInventory] = useState([
    { name: "Toy", effect: 10, iconName: "pets", type: "happiness" },
    { name: "Food", effect: 10, iconName: "fastfood", type: "hunger" },
  ]);
  const [displayHappiness, setDisplayHappiness] = useState(100);
  const [displayHunger, setDisplayHunger] = useState(100);
  const [modalVisible, setModalVisible] = useState(false);
  const happiness = useRef(new Animated.Value(100)).current;
  const hunger = useRef(new Animated.Value(100)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load happiness from AsyncStorage
    const loadData = async () => {
      const savedHappiness = await AsyncStorage.getItem("happiness");
      const savedHunger = await AsyncStorage.getItem("hunger"); // Load hunger
      if (savedHappiness !== null) {
        const parsedHappiness = parseInt(savedHappiness, 10);
        happiness.setValue(parsedHappiness);
        setDisplayHappiness(parsedHappiness);
      }
      if (savedHunger !== null) {
        // Check and set hunger if it exists
        const parsedHunger = parseInt(savedHunger, 10);
        hunger.setValue(parsedHunger);
        setDisplayHunger(parsedHunger);
      }
    };

    loadData();
  }, []);

  // Decrease happiness and hunger over time
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newHappiness = Math.max(0, happiness._value - 1);
      happiness.setValue(newHappiness);
      setDisplayHappiness(newHappiness);
      AsyncStorage.setItem("happiness", newHappiness.toString());

      const newHunger = Math.max(0, hunger._value - 1);
      hunger.setValue(newHunger);
      setDisplayHunger(newHunger); // Decrease hunger over time
      AsyncStorage.setItem("hunger", newHunger.toString());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [happiness, hunger]);

  // Replenish items over time
  useEffect(() => {
    const replenishItems = setInterval(() => {
      setInventory(currentInventory => {
        let newInventory = [...currentInventory];
        const hasToy = currentInventory.some(item => item.name === "Toy");
        const hasFood = currentInventory.some(item => item.name === "Food");
  
        if (!hasToy) {
          newInventory.push({ name: "Toy", effect: 10, iconName: "pets", type: "happiness" });
          console.log("Replenished toy");
        }
  
        if (!hasFood) {
          newInventory.push({ name: "Food", effect: 10, iconName: "fastfood", type: "hunger" });
          console.log("Replenished food");
        }
  
        return newInventory;
      });
    }, 60000); // Check every minute
  
    return () => clearInterval(replenishItems);
  }, []);

  const handleTap = () => {
    playSound();
    triggerVibration();
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    const newHappiness = Math.min(100, happiness._value + 5);
    happiness.setValue(newHappiness); // Directly update for animation
    setDisplayHappiness(newHappiness); // Update displayed happiness
    AsyncStorage.setItem("happiness", newHappiness.toString());
  };

  const handleUseItem = (item) => {
    if (item.type === "happiness") {
      const newHappiness = Math.min(100, happiness._value + item.effect);
      happiness.setValue(newHappiness);
      setDisplayHappiness(newHappiness);
    } else if (item.type === "hunger") {
      const newHunger = Math.min(100, hunger._value + item.effect);
      hunger.setValue(newHunger);
      setDisplayHunger(newHunger);
    }

    AsyncStorage.setItem(item.type, item.effect.toString());

    // Filter out the used item from inventory
    setInventory((currentInventory) =>
      currentInventory.filter((i) => i !== item)
    );
  };

  const opacity = happiness.interpolate({
    inputRange: [0, 100],
    outputRange: [0.3, 1], // Simulate "less happy" with lower opacity
  });

  const triggerVibration = () => {
    Vibration.vibrate();
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(Meow, { shouldPlay: true });
    await sound.playAsync();

    // Optionally, unload the sound from memory after it's played to free up resources
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text>Happiness</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: `${displayHappiness}%` }]}
          />
        </View>

        <Text>Hunger</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[styles.progressBarFill, { width: `${displayHunger}%` }]}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleTap}
        style={{
          justifyContent: "center", // Centers content vertically in container
          alignItems: "center", // Centers content horizontally in container
          flexGrow: 1, // Allows the touchable area to fill the space for centering
        }}
      >
        <Animated.View
          style={{ ...styles.petContainer, transform: [{ scale }] }}
        >
          <Animated.Image
            source={require("../assets/cat.png")}
            style={[styles.petImage, { opacity }]} // Adjusting opacity based on happiness
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.bottomSection}>
        {/* Use an Icon for the inventory button */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="backpack" size={70} color="#000" />
        </TouchableOpacity>

        {/* Modal for inventory selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }} // Aligns modal to bottom
        >
          <View style={styles.modalView}>
            {/* Render inventory items with icons */}
            {inventory.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleUseItem(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Icon name={item.iconName} size={24} color="#000" />
                <Text style={{ marginLeft: 10 }}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Icon name="close" size={24} color="#000" />
              <Text style={{ marginLeft: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default PetApp;

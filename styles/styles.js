import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSection: {
    flex: 0.5, // Gives more space to the bottom section
    justifyContent: "center", // Center align the items
    alignItems: "center", // Horizontally center the content
  },
  inventoryItem: {
    margin: 10,
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
  },
  petImage: {
    width: 200,
    height: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    bottom: 0,
    width: "90%",
  },
  progressContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    marginVertical: 20, // Adds vertical space for separation
    marginTop: 80, // Adds space on top for a more airy feel
    marginLeft: 20, // Adds space on the left for better alignment
    marginRight: 20, // Adds space on the right for better alignment
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginVertical: 5, // Adds space between the bars
  },
  HappinessProgressBarFill: {
    height: "100%",
    backgroundColor: "#0ae00f", 
    borderRadius: 10,
  },
  HungerProgressBarFill: {
    height: "100%",
    backgroundColor: "#e0980a", 
    borderRadius: 10,
  },
});

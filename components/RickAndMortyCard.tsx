import { IRickAndMortyCharacter } from "@/interfaces";
import { Image, Text, View } from "react-native";

interface IRickAndMortyCard {
  character: IRickAndMortyCharacter;
}

export const RickAndMortyCard = (props: IRickAndMortyCard) => {
  const { character } = props;

  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: "white",
        marginVertical: 6,
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <View style={{ width: "auto" }}>
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: character.image,
          }}
        />
      </View>
      <View
        style={{
          width: "70%",
          padding: 10,
          justifyContent: "space-around",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
          {character.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Specie: {character.species}</Text>
          <Text>Gender: {character.gender}</Text>
        </View>
        <Text>Status: {character.status}</Text>
        <Text>Type: {character.type || "N/A"}</Text>
      </View>
    </View>
  );
};

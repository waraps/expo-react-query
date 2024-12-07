import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ITaskStatuses } from "@/interfaces";
import { getTaskStatusName } from "@/helpers";
import { IconSymbol } from "./ui/IconSymbol";
import { TaskStatus } from "@/constants";

export interface ITaskStatusModalRef {
  open: () => void;
  close: () => void;
}

interface ITaskStatusModalProps {
  statuses: ITaskStatuses;
  status: TaskStatus;
  onPress?: (status: TaskStatus) => void;
}

export const TaskStatusModal = forwardRef<
  ITaskStatusModalRef,
  ITaskStatusModalProps
>((props, ref): JSX.Element => {
  const modalRef = useRef<BottomSheetModal>(null);

  const open = useCallback(() => {
    modalRef.current?.present();
  }, []);

  const close = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <BottomSheetModal ref={modalRef}>
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Pick a status task
        </Text>
        {props.statuses.statuses.map((s: TaskStatus) => {
          const onPress = () => props.onPress?.(s);
          return (
            <ModalItems
              key={s}
              status={s}
              statusSelected={props.status}
              onPress={onPress}
            />
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TaskStatusModal.displayName = "TaskStatusModal";

interface IModalItemsProps {
  status: TaskStatus;
  statusSelected: TaskStatus;
  onPress?: () => void;
}

const ModalItems = (props: IModalItemsProps): React.JSX.Element => {
  const { status, statusSelected, onPress } = props;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
      }}
    >
      <Text>{getTaskStatusName(status)}</Text>
      <TouchableOpacity onPress={onPress} disabled={statusSelected === status}>
        <IconSymbol
          size={24}
          name={
            statusSelected === status
              ? "smallcircle.fill.circle.fill"
              : "smallcircle.fill.circle"
          }
          color={"#4169E1"}
        />
      </TouchableOpacity>
    </View>
  );
};

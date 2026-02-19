import type { Meta, StoryObj } from '@storybook/react';
import { useDisclosure } from '../../hooks';
import { Button } from '../atoms/Button';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Molecules/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: { source: { type: 'code' } },
  },
  tags: ['autodocs'],
  argTypes: {
    open: { control: false },
    onClose: { control: false },
    closeOnOverlayClick: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;

/** render로 제어하는 스토리만 사용 → args 생략 가능 */
type Story = Omit<StoryObj<typeof meta>, 'args'> & { args?: Partial<ModalProps> };

const ModalWithTrigger = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>모달 열기</Button>
      <Modal open={isOpen} onClose={close} title="모달 제목" description="설명">
        <p className="text-sm text-gray-600">내용 내용 내용</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            취소
          </Button>
          <Button variant="primary" onClick={close}>
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalWithTrigger />,
  parameters: {
    docs: {
      source: {
        code: `<Modal open={isOpen} onClose={close} title="모달 제목" description="설명">
  <p>내용</p>
  <Button onClick={close}>확인</Button>
</Modal>`,
        language: 'tsx',
      },
    },
  },
};

const TitleOnlyModal = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>제목만</Button>
      <Modal open={isOpen} onClose={close} title="제목만">
        <p>설명 없이 제목과 본문만.</p>
        <Button className="mt-3" onClick={close}>
          닫기
        </Button>
      </Modal>
    </>
  );
};

export const TitleOnly: Story = {
  render: () => <TitleOnlyModal />,
};

const NoOverlayCloseModal = () => {
  const { isOpen, open, close } = useDisclosure();
  return (
    <>
      <Button onClick={open}>오버레이 클릭 비활성</Button>
      <Modal open={isOpen} onClose={close} closeOnOverlayClick={false} title="닫기 버튼만">
        <p>배경 클릭으로는 닫히지 않습니다.</p>
        <Button className="mt-3" onClick={close}>
          닫기
        </Button>
      </Modal>
    </>
  );
};

export const NoOverlayClose: Story = {
  render: () => <NoOverlayCloseModal />,
};

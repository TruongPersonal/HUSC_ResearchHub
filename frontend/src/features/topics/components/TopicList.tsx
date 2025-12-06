import { Topic } from "@/features/topics/types";
import { TopicCard } from "./TopicCard";
import { SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TopicListProps {
    topics: Topic[];
    onViewDetails: (topic: Topic) => void;
    onRegister: (topic: Topic) => void;
    isSessionOpen: boolean;
    showAction?: boolean;
}

export function TopicList({ topics, onViewDetails, onRegister, isSessionOpen, showAction = true }: TopicListProps) {
    if (topics.length === 0) {
        return (
            <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <SearchX className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy đề tài</h3>
                        <p className="text-sm text-gray-500 mt-1">Hiện tại chưa có đề tài nào.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {topics.map((topic) => (
                <TopicCard
                    key={topic.id}
                    topic={topic}
                    onViewDetails={onViewDetails}
                    onRegister={onRegister}
                    isSessionOpen={isSessionOpen}
                    showAction={showAction}
                />
            ))}
        </div>
    );
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class BlogCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection->map(function($data) {
                $publishedAt = $data->getAttribute('published_at') ?: $data->created_at;

                return [
                    'id' => $data->id,
                    'category' => optional($data->category)->getTranslation('name'),
                    'title' => $data->getTranslation('title'),
                    'short_description' => $data->getTranslation('short_description'),
                    'banner' => api_asset($data->banner),
                    'slug' => $data->slug,
                    'type' => $data->getAttribute('type') ?: $data->getAttribute('post_type'),
                    'author' => $data->getAttribute('author') ?: $data->getAttribute('source_handle') ?: $data->getAttribute('source'),
                    'created_at' => $publishedAt ? date('F j, Y', strtotime($publishedAt)) : null,
                ];
            })
        ];
    }

    public function with($request)
    {
        return [
            'success' => true,
            'status' => 200
        ];
    }
}
